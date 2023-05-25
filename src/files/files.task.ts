import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SchedulerRegistry } from '@nestjs/schedule'

import { BaseTask } from '@_base/base.task'
import { CronConfig } from '@_config/cron.config'
import { S3Config } from '@_config/s3.config'
import { ConfigName } from '@_enum/config'
import { Logger } from '@_logger'

import { FilesRepository } from './files.repository'
import { FilesService } from './files.service'

@Injectable()
export class FilesTask extends BaseTask {
  private readonly s3Config: S3Config

  constructor(
    private readonly filesService: FilesService,
    private readonly fileRepository: FilesRepository,
    logger: Logger,
    schedulerRegistry: SchedulerRegistry,
    configService: ConfigService,
  ) {
    super(logger, schedulerRegistry, configService)

    this.s3Config = configService.get<S3Config>(ConfigName.S3)!
    const cronConfig = configService.get<CronConfig>(ConfigName.Cron)!

    if (
      !this.s3Config.buckets.asset.name ||
      !this.s3Config.buckets.asset.keyPrefix
    ) {
      throw new InternalServerErrorException(
        'S3 Asset bucket name or key prefix is missing',
      )
    }

    if (cronConfig.cleanUpOrphanAssets) {
      this._initCronJob(
        'cleanUpOrphanAssets',
        cronConfig.cleanUpOrphanAssets,
        this.cleanUpOrphanAssets,
      )
    }
  }

  async cleanUpOrphanAssets(): Promise<void> {
    try {
      this.logger.debug(`[cleanUpOrphanAssets] Starting task`)

      const bucket = this.s3Config.buckets.asset.name!

      const s3FileRecords: { [key: string]: 1 } = {}
      const dbFileRecords: { [key: string]: 1 } = {}

      const [s3FileList, dbFileList, dbInvalidFileList] = await Promise.all([
        this.filesService
          ._listS3Files(bucket, this.s3Config.buckets.asset.keyPrefix)
          .then((res) => {
            res.forEach((f) => (s3FileRecords[f] = 1))
            return res
          }),
        this.fileRepository._list().then((res) => {
          res.forEach((f) => (dbFileRecords[f.uploadedPath] = 1))
          return res
        }),
        this.fileRepository._listOrphans(),
      ])

      this.logger.debug(
        `[cleanUpOrphanAssets] Found ${dbFileList.length} db records, ${s3FileList.length} s3 files`,
      )

      const s3Orphans = s3FileList.filter(
        (fileKey) => !(fileKey in dbFileRecords),
      )
      const dbOrphans = dbFileList.filter(
        (file) => !(file.uploadedPath in s3FileRecords),
      )

      this.logger.log(
        `[cleanUpOrphanAssets] Found ${s3Orphans.length} s3 orphans, ${dbOrphans.length} db orphans, ${dbInvalidFileList.length} invalid db files`,
      )

      await Promise.all([
        s3Orphans.map((fileKey) => this.filesService._delete(bucket, fileKey)),
        dbOrphans.map((file) =>
          this.fileRepository.deleteByKey(file.uploadedPath),
        ),
        dbInvalidFileList.map((file) =>
          this.fileRepository.deleteByKey(file.uploadedPath),
        ),
      ])
      this.logger.debug(`[cleanUpOrphanAssets] Done`)
    } catch (e) {
      this.logger.debug(`[cleanUpOrphanAssets] Exception occurred ${e}`)
    }
  }
}
