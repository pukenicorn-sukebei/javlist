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
import { Injectable } from '@nestjs/common'
import { Job } from 'bull'
import * as DayJS from 'dayjs'
import { Observer, Subject, Subscription, noop } from 'rxjs'

import { PornScraperService } from '@_clients/porn-scraper.service'
import { QueueName } from '@_enum/queue'
import { FileType, Prisma, PrismaClient } from '@_generated/prisma'
import { Logger } from '@_logger'

import { FilesService } from '../files/files.service'
import { PeopleService } from '../people/people.service'
import { VideoWithInclude, VideosDefaultInclude } from './videos.dto'

export interface PornScraperJobRequest {
  code: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PornScraperJob extends Job<PornScraperJobRequest> {}

export interface PornScraperJobResult {
  code: string
  data?: VideoWithInclude | null
  err?: Error
}

@Injectable()
@Processor(QueueName.PornScraper)
export class VideosConsumer {
  private readonly resultObservableSubj: Subject<PornScraperJobResult>

  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaClient,
    private readonly pornScraperService: PornScraperService,
    private readonly filesService: FilesService,
    private readonly peopleService: PeopleService,
  ) {
    this.logger.setContext(VideosConsumer.name)
    this.resultObservableSubj = new Subject<PornScraperJobResult>()
  }

  public subscribeObservable(
    observer: Observer<PornScraperJobResult>,
  ): Subscription {
    return this.resultObservableSubj.subscribe(observer)
  }

  @Process()
  public async processQueue(job: PornScraperJob): Promise<VideoWithInclude> {
    // noinspection UnnecessaryLocalVariableJS
    const video = await this.fetchVideoFromScraper(job.data.code, job)

    return video
  }

  public async fetchVideoFromScraper(
    code: string,
    job?: PornScraperJob,
  ): Promise<VideoWithInclude> {
    const scraperResult = await this.pornScraperService.getByCode(code)

    job?.progress(20).catch(noop)

    const data = scraperResult.data

    const releaseDate = data.release_date
      ? DayJS.utc(data.release_date).toDate()
      : undefined

    const actorsPromise = this.peopleService.find(data.actresses)
    const coverPromise = this.filesService.uploadAssetFromUrl(
      FileType.VideoCover,
      data.image,
    )

    Promise.resolve([actorsPromise, coverPromise])
      .then((x) => [
        Promise.any(x).then(() => job?.progress(40)),
        Promise.all(x).then(() => job?.progress(60)),
      ])
      .catch(noop)

    const actors = await actorsPromise
    const cover = await coverPromise

    const params: Prisma.XOR<
      Prisma.VideoCreateInput,
      Prisma.VideoUncheckedCreateInput
    > = {
      code: data.code.trim(),
      name: data.name.trim(),
      releaseDate,
      coverPath: cover.uploadedPath,
      length: 0,
      label: {
        connectOrCreate: {
          create: { name: 'placeholder' },
          where: { name: 'placeholder' },
        },
      },
      maker: {
        connectOrCreate: {
          create: { name: data.studio.trim() },
          where: { name: data.studio.trim() },
        },
      },
      actors: {
        connect: actors.map((actor) => ({ id: actor.id })),
      },
      tags: {
        connectOrCreate: data.genres.map((tag) => ({
          create: { name: tag.trim() },
          where: { name: tag.trim() },
        })),
      },
    }

    job?.progress(80).catch(noop)

    return this.prisma.video.upsert({
      include: VideosDefaultInclude,
      where: { code: data.code.trim() },
      create: params,
      update: params,
    })
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
  onQueueCompleted(job: PornScraperJob, result: VideoWithInclude) {
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
