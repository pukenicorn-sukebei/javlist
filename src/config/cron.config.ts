import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export class CronConfig {
  constructor(data: Partial<CronConfig>) {
    Object.assign(this, data)
  }

  cleanUpOrphanAssets?: string
}

export default registerAs<CronConfig>(
  ConfigName.Cron,
  () =>
    new CronConfig({
      cleanUpOrphanAssets: process.env[Env.Cron.CleanUpOrphanAssets],
    }),
)
