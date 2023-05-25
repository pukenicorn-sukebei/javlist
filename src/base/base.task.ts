import { ConfigService } from '@nestjs/config'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

import { AppConfig } from '@_config/app.config'
import { ConfigName } from '@_enum/config'
import { Logger } from '@_logger'

export abstract class BaseTask {
  private readonly appConfig: AppConfig

  protected constructor(
    protected readonly logger: Logger,
    protected readonly schedulerRegistry: SchedulerRegistry,
    configService: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name)
    this.appConfig = configService.get<AppConfig>(ConfigName.App)!
  }

  protected _initCronJob(
    name: string,
    cronString: string,
    func: VoidFunction,
  ): void {
    if (!this.appConfig.cronJobEnabled) {
      this.logger.log(
        `Skipping job registration for "${name}" since cron job is disabled`,
      )
      return
    }

    const job = new CronJob(cronString, func.bind(this))
    this.schedulerRegistry.addCronJob(name, job)
    job.start()

    this.logger.log(`Register job for "${name}" with "${cronString}"`)
  }
}
