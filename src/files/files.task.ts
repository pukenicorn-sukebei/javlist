import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SchedulerRegistry } from '@nestjs/schedule'

import { BaseTask } from '@_base/base.task'
import { CronConfig } from '@_config/cron.config'
import { S3Config } from '@_config/s3.config'
import { ConfigName } from '@_enum/config'
import { PrismaClient } from '@_generated/prisma'
import { Logger } from '@_logger'

import { FilesService } from './files.service'

@Injectable()
export class FilesTask extends BaseTask {
  private readonly s3Config: S3Config

  constructor(
    private readonly filesService: FilesService,
    private readonly prisma: PrismaClient,
    logger: Logger,
    schedulerRegistry: SchedulerRegistry,
    configService: ConfigService,
  ) {
    super(logger, schedulerRegistry)

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

      const fileRecords: { [key: string]: 1 } = {}

      const [fileList] = await Promise.all([
        this.filesService._listFiles(
          bucket,
          this.s3Config.buckets.asset.keyPrefix,
        ),
        this.prisma.file
          .findMany({
            where: { uploadedBucket: bucket },
          })
          .then((res) => res.forEach((f) => (fileRecords[f.uploadedPath] = 1))),
      ])

      this.logger.debug(
        `[cleanUpOrphanAssets] Found ${
          Object.keys(fileRecords).length
        } db records, ${fileList.length} s3 files`,
      )

      const orphans = fileList.filter((fileKey) => !(fileKey in fileRecords))

      this.logger.log(`[cleanUpOrphanAssets] Found ${orphans.length} orphans`)

      await Promise.all(
        orphans.map((fileKey) => this.filesService._delete(bucket, fileKey)),
      )
      this.logger.debug(`[cleanUpOrphanAssets] Done`)
    } catch (e) {
      this.logger.debug(`[cleanUpOrphanAssets] Exception occurred ${e}`)
    }
  }
}
