import {
  OnQueueActive,
  OnQueueCleaned,
  OnQueueCompleted,
  OnQueueDrained,
  OnQueueError,
  OnQueueFailed,
  OnQueuePaused,
  OnQueueProgress,
  OnQueueRemoved,
  OnQueueResumed,
  OnQueueStalled,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Job } from 'bull'
import * as DayJS from 'dayjs'
import { Observer, Subject, Subscription, noop } from 'rxjs'

import { PornScraperService } from '@_clients/porn-scraper.service'
import { QueueName } from '@_enum/queue'
import { Logger } from '@_logger'
import { Video, VideoCover, VideoSample, VideoType } from '@_models'

import { FileType } from '../files/file-type.enum'
import { FilesService } from '../files/files.service'
import { PeopleService } from '../people/people.service'
import { VideosRepository } from './videos.repository'

export interface PornScraperJobRequest {
  code: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PornScraperJob extends Job<PornScraperJobRequest> {}

export interface PornScraperJobResult {
  code: string
  data?: Video | null
  err?: Error
}

@Injectable()
@Processor(QueueName.PornScraper)
export class VideosConsumer {
  private readonly resultObservableSubj: Subject<PornScraperJobResult>

  constructor(
    private readonly logger: Logger,
    private readonly videoRepository: VideosRepository,
    private readonly pornScraperService: PornScraperService,
    private readonly filesService: FilesService,
    private readonly peopleService: PeopleService,
  ) {
    this.logger.setContext(this.constructor.name)
    this.resultObservableSubj = new Subject<PornScraperJobResult>()
  }

  public subscribeObservable(
    observer: Observer<PornScraperJobResult>,
  ): Subscription {
    return this.resultObservableSubj.subscribe(observer)
  }

  @Process()
  public async processQueue(job: PornScraperJob): Promise<Video> {
    return this.fetchVideoFromScraper(job.data.code, job)
  }

  public async fetchVideoFromScraper(
    code: string,
    job?: PornScraperJob,
  ): Promise<Video> {
    const scraperResult = await this.pornScraperService.getByCode(code)

    job?.progress(20).catch(noop)

    const data = scraperResult.data

    const releaseDate = data.release_date
      ? DayJS.utc(data.release_date).toDate()
      : undefined

    const actorsPromise = this.peopleService.findMany(data.actors, {
      createOnNotFound: true,
    })
    const directorsPromise = this.peopleService.findMany(data.directors, {
      createOnNotFound: true,
    })

    const coverPromise = data.cover_url
      ? this.filesService
          .uploadAssetFromUrl(FileType.VideoCover, data.cover_url)
          .then((x) => x as VideoCover)
      : undefined

    const samplesPromise = Promise.all(
      data.sample_image_urls.map((sample) =>
        this.filesService
          .uploadAssetFromUrl(FileType.VideoSample, sample)
          .then((x) => x as VideoSample),
      ),
    )

    const tagsPromise = this.videoRepository.findManyTags(data.tags, {
      createOnNotFound: true,
    })

    // noinspection ES6MissingAwait
    const makerPromise = data.maker
      ? this.videoRepository.findMaker(data.maker, { createOnNotFound: true })
      : undefined

    // noinspection ES6MissingAwait
    const labelPromise = data.label
      ? this.videoRepository.findLabel(data.label, { createOnNotFound: true })
      : undefined

    const allPromises = [
      actorsPromise,
      directorsPromise,
      coverPromise,
      samplesPromise,
      tagsPromise,
      makerPromise,
      labelPromise,
    ].filter((x) => x) as Promise<unknown>[]

    allPromises.map((promise) =>
      promise.then(() =>
        job?.progress(job?.progress() + 60 / allPromises.length),
      ),
    )

    const videoPromise = this.videoRepository.findByCode(data.code, {
      loadRelation: true,
      initOnNotFound: true,
    })

    const cleanupPromise = [
      videoPromise.then((video) => {
        if (video.cover) {
          return this.filesService._delete(
            video.cover.uploadedBucket,
            video.cover.uploadedPath,
          )
        }
      }),
    ]

    await Promise.all(allPromises)

    const video = await videoPromise

    if (!video) {
      throw new InternalServerErrorException(
        'Somehow `video` does not get create',
      )
    }
    video.type = VideoType.Jav
    video.code = data.code.toUpperCase()
    video.title = data.name ?? undefined
    video.releaseDate = releaseDate ?? undefined
    video.cover = (await coverPromise) ?? undefined
    video.samples = await samplesPromise
    video.length = data.length ?? undefined
    video.actors = await actorsPromise
    video.directors = await directorsPromise
    video.tags = await tagsPromise
    video.maker = (await makerPromise) ?? undefined
    video.label = (await labelPromise) ?? undefined

    await Promise.all(cleanupPromise)

    return this.videoRepository.save(video)
  }

  //////////////////////////////////////////////////////////////////////////////

  @OnQueueError()
  onQueueError(error: Error) {
    this.logger.error(`[Queue] Error: ${error}`)
  }

  @OnQueueWaiting()
  onQueueWaiting(jobId: number | string) {
    this.logger.debug(`[Queue] Job ${jobId} waiting`)
  }

  @OnQueueActive()
  onQueueActive(job: PornScraperJob) {
    this.logger.debug(`[Queue] Job ${job.id} active`)
  }

  @OnQueueStalled()
  onQueueStalled(job: PornScraperJob) {
    this.logger.debug(`[Queue] Job ${job.id} stalled`)
  }

  @OnQueueProgress()
  onQueueProgress(job: PornScraperJob, progress: number) {
    this.logger.verbose(`[Queue] Job ${job.id} progress: ${progress}`)
  }

  @OnQueueCompleted()
  onQueueCompleted(job: PornScraperJob, result: Video) {
    this.logger.debug(`[Queue] Job ${job.id} completed`)
    this.resultObservableSubj.next({
      code: job.data.code,
      data: result,
    })
  }

  @OnQueueFailed()
  onQueueFailed(job: PornScraperJob, err: Error) {
    this.logger.error(`[Queue] Job ${job.id} failed: ${err}`)
    this.resultObservableSubj.next({
      code: job.data.code,
      err,
    })
  }

  @OnQueuePaused()
  onQueuePaused() {
    this.logger.verbose('[Queue] Paused')
  }

  @OnQueueResumed()
  onQueueResumed(job: PornScraperJob) {
    this.logger.debug(`[Queue] Job ${job.id} resumed`)
  }

  @OnQueueCleaned()
  onQueueCleaned(jobs: PornScraperJob[], type: string) {
    this.logger.verbose(
      `[Queue] Cleaned: ${type} [${jobs.map((job) => `${job.id}`).join(',')}]`,
    )
    jobs.forEach((job) => {
      this.resultObservableSubj.next({
        code: job.data.code,
        data: null,
      })
    })
  }

  @OnQueueDrained()
  onQueueDrained() {
    this.logger.verbose('[Queue] Drained')
  }

  @OnQueueRemoved()
  onQueueRemoved(job: PornScraperJob) {
    this.logger.debug(`[Queue] Job ${job.id} removed`)
    this.resultObservableSubj.next({
      code: job.data.code,
      data: null,
    })
  }
}
