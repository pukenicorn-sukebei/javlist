import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'
import { LogLevel, parseLogLevel } from '@_enum/log-level'
import { parseBool } from '@_utils/parsers'

export class AppConfig {
  constructor(data: Partial<AppConfig>) {
    Object.assign(this, data)
  }

  nodeEnv: string
  appEnv: string
  debug: boolean
  name?: string
  port: number
  apiPrefix: string
  logLevel: LogLevel
  cronJobEnabled: boolean
}

export default registerAs<AppConfig>(
  ConfigName.App,
  () =>
    new AppConfig({
      nodeEnv: process.env[Env.App.NodeEnv],
      appEnv: process.env[Env.App.AppEnv] || 'development',
      debug: process.env[Env.App.AppEnv] !== 'production',
      name: process.env[Env.App.AppName],
      port: parseInt(
        process.env[Env.App.AppPort] || process.env[Env.App.Port] || '3000',
        10,
      ),
      apiPrefix: process.env[Env.App.ApiPrefix],
      logLevel: parseLogLevel(process.env[Env.App.LogLevel]),
      cronJobEnabled: parseBool(process.env[Env.App.CronJobsEnabled]),
    }),
)
