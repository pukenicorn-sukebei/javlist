import { InjectQueue } from '@nestjs/bull'
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Optional,
  RequestTimeoutException,
} from '@nestjs/common'
import { Queue } from 'bull'
import { Subscription } from 'rxjs'

import { PornScraperService } from '@_clients/porn-scraper.service'
import { PrismaService } from '@_database/prisma.service'
import { QueueName } from '@_enum/queue'
import { Logger } from '@_logger'
import { stringifyAliases } from '@_utils/alias'
import { PaginationDto } from '@_utils/dto/pagination.dto'
import * as NormalizerUtils from '@_utils/normalizer'
import {
  paginationOptionsToPrismaPaginationArgs,
  paginationOptionsToPrismaSortByArgs,
} from '@_utils/pagination-options'
import { IPaginationOptions } from '@_utils/types/pagination-options'

import { FilesService } from '../files/files.service'
import { PornScraperJobRequest, VideosConsumer } from './videos.consumer'
import { VideoDto, VideoWithInclude, VideosDefaultInclude } from './videos.dto'

@Injectable()
export class VideosService {
  private static DEFAULT_ORDER = '-releaseDate'

  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
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
    pagination: IPaginationOptions = new PaginationDto(),
  ): Promise<VideoWithInclude[]> {
    return this.prisma.video.findMany({
      include: VideosDefaultInclude,
      ...paginationOptionsToPrismaPaginationArgs(pagination),
      ...paginationOptionsToPrismaSortByArgs(
        pagination,
        VideosService.DEFAULT_ORDER,
      ),
    })
  }

  async findByCodes(
    codes: string[],
    pagination: IPaginationOptions = new PaginationDto(),
  ): Promise<VideoWithInclude[]> {
    codes = codes
      .map(NormalizerUtils.normalizeCode)
      .filter((x) => x) as string[]

    const videos = await this.prisma.video.findMany({
      include: VideosDefaultInclude,
      where: {
        code: { in: codes },
      },
      ...paginationOptionsToPrismaSortByArgs(
        pagination,
        VideosService.DEFAULT_ORDER,
      ),
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
    pagination: IPaginationOptions = new PaginationDto(),
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
      ...paginationOptionsToPrismaPaginationArgs(pagination),
      ...paginationOptionsToPrismaSortByArgs(
        pagination,
        VideosService.DEFAULT_ORDER,
      ),
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
}
