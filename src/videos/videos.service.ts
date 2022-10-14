import { InjectQueue } from '@nestjs/bull'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Optional,
  RequestTimeoutException,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { Queue } from 'bull'
import { Subscription } from 'rxjs'

import { PornScraperService } from '@_clients/porn-scraper.service'
import { QueueName } from '@_enum/queue'
import { stringifyAliases } from '@_utils/alias'
import { paginationToPrismaArgs } from '@_utils/infinity-pagination'
import { IPaginationOptions } from '@_utils/types/pagination-options'

import { FilesService } from '../files/files.service'
import { PornScraperJobRequest, VideosConsumer } from './videos.consumer'
import { VideoDto, VideoWithInclude, VideosDefaultInclude } from './videos.dto'

@Injectable()
export class VideosService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly pornScraperService: PornScraperService,
    private readonly filesService: FilesService,
    private readonly videosConsumer: VideosConsumer,
    @InjectQueue(QueueName.PornScraper)
    @Optional()
    private readonly pornScraperQueue?: Queue<PornScraperJobRequest>,
  ) {}

  async toDto(video: VideoWithInclude): Promise<VideoDto> {
    const [coverUrl] = await Promise.all([
      this.filesService.getAssetPreSignedUrl(video.coverUrlKey),
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
    const video = await this.prisma.video.findUnique({
      include: VideosDefaultInclude,
      where: { code },
    })
    if (!forceUpdate && video) {
      return video
    }

    return this._fetchFromScraper(code)
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
      } else if (codes.length > pagination.amount) {
        throw new BadRequestException(
          '`codes` can not be larger than page size',
        )
      }
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
      return videos
    }

    const existingVideoCodes = videos.map((v) => v.code)
    const newVideos = await Promise.all(
      codes
        .filter((x) => !existingVideoCodes.includes(x))
        .map((code) => this._fetchFromScraper(code)),
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
      return this._fetchFromScraperWithQueue(code)
    }

    return this.videosConsumer.fetchVideoFromScraper(code)
  }

  private async _fetchFromScraperWithQueue(
    code: string,
  ): Promise<VideoWithInclude> {
    let subscription: Subscription
    const resultPromise = new Promise<VideoWithInclude>((resolve, reject) => {
      const timerId = setTimeout(
        () => reject(new RequestTimeoutException()),
        20000,
      )
      subscription = this.videosConsumer.subscribeObservable({
        next: (result) => {
          if (result.code === code) {
            clearTimeout(timerId)
            if (result.err) {
              reject(result.err)
            }
            if (result.data === null) {
              reject(new Error('Queue was probably canceled'))
            }
            resolve(result.data)
          }
        },
        error: (err) => reject(err),
        complete: () =>
          reject(
            new InternalServerErrorException('something must have went wrong'),
          ),
      })
    })
    resultPromise.finally(() => {
      subscription?.unsubscribe()
    })

    // TODO might need to normalize code for job id
    await this.pornScraperQueue.add({ code }, { jobId: code })

    return resultPromise
  }
}
