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
import { QueueName } from '@_enum/queue'
import { Logger } from '@_logger'
import { Video } from '@_models'
import { stringifyAliases } from '@_utils/alias'
import { PaginationDto } from '@_utils/dto/pagination.dto'
import * as NormalizerUtils from '@_utils/normalizer'
import { paginationOptionsToQueryArgs } from '@_utils/pagination-options'
import { IPaginationOptions } from '@_utils/types/pagination-options'

import { FilesService } from '../files/files.service'
import { PornScraperJobRequest, VideosConsumer } from './videos.consumer'
import { VideoDto } from './videos.dto'
import { QueryOptions, VideosRepository } from './videos.repository'

@Injectable()
export class VideosService {
  private static DEFAULT_ORDER = '-releaseDate'

  constructor(
    private readonly logger: Logger,
    private readonly pornScraperService: PornScraperService,
    private readonly filesService: FilesService,
    private readonly videosConsumer: VideosConsumer,
    private readonly videoRepository: VideosRepository,
    @InjectQueue(QueueName.PornScraper)
    @Optional()
    private readonly pornScraperQueue?: Queue<PornScraperJobRequest>,
  ) {
    logger.setContext(VideosService.name)
  }

  async toDto(video: Video): Promise<VideoDto> {
    const [coverUrl, sampleUrls] = await Promise.all([
      video.cover
        ? this.filesService.getPreSignedUrl(
            video.cover.uploadedBucket,
            video.cover.uploadedPath,
          )
        : null,
      Promise.all(
        video.samples?.map((sample) =>
          this.filesService.getPreSignedUrl(
            sample.uploadedBucket,
            sample.uploadedPath,
          ),
        ),
      ),
    ])

    return {
      id: video.id,
      code: video.code,
      name: video.title,
      releaseDate: video.releaseDate,
      length: video.length || null,
      // createdAt: video.createdAt,
      // updatedAt: video.updatedAt,
      coverUrl,
      sampleUrls,
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

  async findByCode(code: string, { forceUpdate = false } = {}): Promise<Video> {
    const normalizedCode = NormalizerUtils.normalizeCode(code)
    if (!normalizedCode) throw new NotFoundException('Invalid code')

    const video = await this.videoRepository.findByCode(normalizedCode)

    if (video && !forceUpdate) {
      return video
    }

    this.logger.verbose(
      `[findByCode] fetching [${normalizedCode}]; [forceUpdate]: ${forceUpdate}`,
    )

    return this._fetchFromScraper(normalizedCode)
  }

  async getVideos(
    query: QueryOptions = {},
    pagination: IPaginationOptions = new PaginationDto(),
  ): Promise<Video[]> {
    return this.videoRepository.findBy(
      query,
      paginationOptionsToQueryArgs(pagination, VideosService.DEFAULT_ORDER),
    )
  }

  private async _fetchFromScraper(code: string): Promise<Video> {
    if (this.pornScraperQueue) {
      this.logger.debug(`[${code}]: fetch with queue`)
      return this._fetchFromScraperWithQueue(code)
    } else {
      this.logger.debug(`[${code}]: fetch without queue`)
      return this.videosConsumer.fetchVideoFromScraper(code)
    }
  }

  private async _fetchFromScraperWithQueue(code: string): Promise<Video> {
    const normalizedCode = NormalizerUtils.normalizeCode(code)
    if (!normalizedCode) throw new NotFoundException('Invalid code')

    let subscription: Subscription
    const resultPromise = new Promise<Video>((resolve, reject) => {
      const timerId = setTimeout(() => {
        this.logger.error(`[${normalizedCode}][Queue]: Request timed out`)
        reject(new RequestTimeoutException())
      }, 20000)
      subscription = this.videosConsumer.subscribeObservable({
        next: (result) => {
          if (result.code === normalizedCode) {
            clearTimeout(timerId)
            if (result.data) {
              this.logger.verbose(
                `[${normalizedCode}][Queue]: Resolved with ${result.data}`,
              )
              resolve(result.data)
            } else if (result.err) {
              this.logger.error(
                `[${normalizedCode}][Queue]: Resolved to error: ${result.err}`,
              )
              reject(result.err)
            } else {
              this.logger.error(
                `[${normalizedCode}][Queue]: Probably canceled; ${JSON.stringify(
                  result,
                )}`,
              )
              reject(new Error('Queue was probably canceled'))
            }
          }
        },
        error: (err) => {
          this.logger.error(
            `[${normalizedCode}][Queue]: Returned error: ${err}`,
          )
          reject(err)
        },
        complete: () => {
          this.logger.error(
            `[${normalizedCode}][Queue]: Something must have went wrong`,
          )
          reject(
            new InternalServerErrorException('Something must have went wrong'),
          )
        },
      })
    })
    resultPromise.finally(() => {
      subscription?.unsubscribe()
    })

    await this.pornScraperQueue!.add(
      { code: normalizedCode },
      { jobId: normalizedCode },
    )

    return resultPromise
  }
}
