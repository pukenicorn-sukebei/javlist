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
import { Prisma, PrismaClient } from '@prisma/client'
import { Job } from 'bull'
import * as DayJS from 'dayjs'
import { Observer, Subject, Subscription, noop } from 'rxjs'

import { PornScraperService } from '@_clients/porn-scraper.service'
import { QueueName } from '@_enum/queue'

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
    private readonly prisma: PrismaClient,
    private readonly pornScraperService: PornScraperService,
    private readonly filesService: FilesService,
    private readonly peopleService: PeopleService,
  ) {
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

    job?.progress(50).catch(noop)

    const data = scraperResult.data

    const releaseDate = data.release_date
      ? DayJS.utc(data.release_date).toDate()
      : undefined

    const [actors, coverKey] = await Promise.all([
      this.peopleService.find(data.actresses),
      this.filesService.uploadAssetFromUrl(data.image),
    ])

    job?.progress(75).catch(noop)

    const params: Prisma.XOR<
      Prisma.VideoCreateInput,
      Prisma.VideoUncheckedCreateInput
    > = {
      code: data.code.trim(),
      name: data.name.trim(),
      releaseDate,
      coverUrlKey: coverKey,
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

    return this.prisma.video.upsert({
      include: VideosDefaultInclude,
      where: { code: data.code.trim() },
      create: params,
      update: params,
    })
  }

  //////////////////////////////////////////////////////////////////////////////
  // TODO properly implement logging

  @OnQueueError()
  onQueueError(error: Error) {
    console.info(`queue error: ${error}`)
  }

  @OnQueueWaiting()
  onQueueWaiting(jobId: number | string) {
    console.info(`job ${jobId} waiting`)
  }

  @OnQueueActive()
  onQueueActive(job: PornScraperJob) {
    console.info(`job ${job.id} active`)
  }

  @OnQueueStalled()
  onQueueStalled(job: PornScraperJob) {
    console.info(`job ${job.id} stalled`)
  }

  @OnQueueProgress()
  onQueueProgress(job: PornScraperJob, progress: number) {
    console.info(`job ${job.id} progress: ${progress}`)
  }

  @OnQueueCompleted()
  onQueueCompleted(job: PornScraperJob, result: VideoWithInclude) {
    console.info(`job ${job.id} completed`)
    this.resultObservableSubj.next({
      code: job.data.code,
      data: result,
    })
  }

  @OnQueueFailed()
  onQueueFailed(job: PornScraperJob, err: Error) {
    console.info(`job ${job.id} failed: ${err}`)
    this.resultObservableSubj.next({
      code: job.data.code,
      err,
    })
  }

  @OnQueuePaused()
  onQueuePaused() {
    console.info('queue paused')
  }

  @OnQueueResumed()
  onQueueResumed(job: PornScraperJob) {
    console.info(`job ${job.id} resumed`)
  }

  @OnQueueCleaned()
  onQueueCleaned(jobs: PornScraperJob[], type: string) {
    console.info(
      `queue cleaned: ${type} [${jobs
        .map((job) => `${job.id}`)
        .join(',')}]`,
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
    console.info('queue drained')
  }

  @OnQueueRemoved()
  onQueueRemoved(job: PornScraperJob) {
    console.info(`job ${job.id} removed`)
    this.resultObservableSubj.next({
      code: job.data.code,
      data: null,
    })
  }
}
