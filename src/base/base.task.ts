import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

import { Logger } from '@_logger'

export abstract class BaseTask {
  protected constructor(
    protected readonly logger: Logger,
    protected readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.logger.setContext(this.constructor.name)
  }

  protected _initCronJob(
    name: string,
    cronString: string,
    func: VoidFunction,
  ): void {
    const job = new CronJob(cronString, func.bind(this))
    this.schedulerRegistry.addCronJob(name, job)
    job.start()

    this.logger.log(`Register job for "${name}" with "${cronString}"`)
  }
}
