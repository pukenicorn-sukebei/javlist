import { InjectQueue } from '@nestjs/bull'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Optional,
  RequestTimeoutException,
} from '@nestjs/common'
import { Queue } from 'bull'
import { Subscription } from 'rxjs'

import { PornScraperService } from '@_clients/porn-scraper.service'
import { QueueName } from '@_enum/queue'
import { PrismaClient } from '@_generated/prisma'
import { Logger } from '@_logger'
import { stringifyAliases } from '@_utils/alias'
import { paginationToPrismaArgs } from '@_utils/infinity-pagination'
import * as NormalizerUtils from '@_utils/normalizer'
import { IPaginationOptions } from '@_utils/types/pagination-options'

import { FilesService } from '../files/files.service'
import { PornScraperJobRequest, VideosConsumer } from './videos.consumer'
import { VideoDto, VideoWithInclude, VideosDefaultInclude } from './videos.dto'

@Injectable()
export class VideosService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaClient,
    private readonly pornScraperService: PornScraperService,
    private readonly filesService: FilesService,
    private readonly videosConsumer: VideosConsumer,
    @InjectQueue(QueueName.PornScraper)
    @Optional()
    private readonly pornScraperQueue?: Queue<PornScraperJobRequest>,
  ) {
    logger.setContext(VideosService.name)
  }

  async toDto(video: VideoWithInclude): Promise<VideoDto> {
    const [coverUrl] = await Promise.all([
      this.filesService.getAssetPreSignedUrl(video.coverPath),
    ])

    return {
      id: video.id,
      code: video.code,
      name: video.name,
      releaseDate: video.releaseDate,
      length: video.length,
      // createdAt: video.createdAt,
      // updatedAt: video.updatedAt,
      coverUrl,
      maker: video.maker?.name || null,
      label: video.label?.name || null,
      tags: video.tags?.map((tag) => tag.name),
      directors:
        video.directors?.map((director) =>
          stringifyAliases(director.aliases),
        ) || [],
      actors:
        video.actors?.map((actor) => stringifyAliases(actor.aliases)) || [],
    }
  }

  async findByCode(
    code: string,
    { forceUpdate = false } = {},
  ): Promise<VideoWithInclude> {
    const normalizedCode = NormalizerUtils.normalizeCode(code)
    if (!normalizedCode) throw new NotFoundException('Invalid code')

    const video = await this.prisma.video.findUnique({
      include: VideosDefaultInclude,
      where: { code: normalizedCode },
    })
    if (!forceUpdate && video) {
      return video
    }

    this.logger.verbose(
      `[findByCode] fetching [${normalizedCode}]; [forceUpdate]: ${forceUpdate}`,
    )

    return this._fetchFromScraper(normalizedCode)
  }

  async findAll(
    codes?: string[],
    pagination: IPaginationOptions = {},
  ): Promise<VideoWithInclude[]> {
    if (codes?.length) {
      if (pagination.page !== 1) {
        throw new BadRequestException(
          'Can not paginate when `codes` is present',
        )
      } else if (codes.length > pagination.amount!) {
        throw new BadRequestException(
          '`codes` can not be larger than page size',
        )
      }
      codes = codes
        .map(NormalizerUtils.normalizeCode)
        .filter((x) => x) as string[]
    }

    const videos = await this.prisma.video.findMany({
      include: VideosDefaultInclude,
      where: {
        code: codes ? { in: codes } : undefined,
      },
      ...paginationToPrismaArgs(pagination),
      orderBy: { releaseDate: 'desc' },
    })

    if (!codes?.length) {
      this.logger.verbose(`[findAll] no codes specified, skipping fetch`)
      return videos
    } else if (codes?.length === videos.length) {
      this.logger.verbose(`[findAll] got all codes specified, skipping fetch`)
      return videos
    }

    const existingVideoCodes = videos.map((v) => v.code)
    const missingVideoCodes = codes.filter(
      (x) => !existingVideoCodes.includes(x),
    )
    this.logger.debug(`[findAll] fetching [${missingVideoCodes.join(', ')}]`)
    const newVideos = await Promise.all(
      missingVideoCodes.map((code) => this._fetchFromScraper(code)),
    )

    return [...videos, ...newVideos]
  }

  async findByTags(
    tags: string[],
    pagination: IPaginationOptions = {},
  ): Promise<VideoWithInclude[]> {
    return this.prisma.video.findMany({
      include: VideosDefaultInclude,
      where: {
        tags: {
          every: {
            name: { in: tags },
          },
        },
      },
      ...paginationToPrismaArgs(pagination),
      orderBy: { releaseDate: 'desc' },
    })
  }

  private async _fetchFromScraper(code: string): Promise<VideoWithInclude> {
    if (this.pornScraperQueue) {
      this.logger.debug(`[${code}]: fetch with queue`)
      return this._fetchFromScraperWithQueue(code)
    } else {
      this.logger.debug(`[${code}]: fetch directly`)
      return this.videosConsumer.fetchVideoFromScraper(code)
    }
  }

  private async _fetchFromScraperWithQueue(
    code: string,
  ): Promise<VideoWithInclude> {
    // TODO might need to normalize code for job id

    let subscription: Subscription
    const resultPromise = new Promise<VideoWithInclude>((resolve, reject) => {
      const timerId = setTimeout(() => {
        this.logger.error(`[${code}][Queue]: Request timed out`)
        reject(new RequestTimeoutException())
      }, 20000)
      subscription = this.videosConsumer.subscribeObservable({
        next: (result) => {
          if (result.code === code) {
            clearTimeout(timerId)
            if (result.data) {
              this.logger.verbose(
                `[${code}][Queue]: Resolved with ${result.data}`,
              )
              resolve(result.data)
            } else if (result.err) {
              this.logger.error(
                `[${code}][Queue]: Resolved to error: ${result.err}`,
              )
              reject(result.err)
            } else {
              this.logger.error(
                `[${code}][Queue]: Probably canceled; ${JSON.stringify(
                  result,
                )}`,
              )
              reject(new Error('Queue was probably canceled'))
            }
          }
        },
        error: (err) => {
          this.logger.error(`[${code}][Queue]: Returned error: ${err}`)
          reject(err)
        },
        complete: () => {
          this.logger.error(`[${code}][Queue]: Something must have went wrong`)
          reject(
            new InternalServerErrorException('Something must have went wrong'),
          )
        },
      })
    })
    resultPromise.finally(() => {
      subscription?.unsubscribe()
    })

    await this.pornScraperQueue!.add({ code }, { jobId: code })

    return resultPromise
  }

  // TODO remove file paths without record
}
