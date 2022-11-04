import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'
import { LogLevel, parseLogLevel } from '@_enum/log-level'

export class AppConfig {
  constructor(data: Partial<AppConfig>) {
    Object.assign(this, data)
  }

  nodeEnv: string
  debug: boolean
  name?: string
  port: number
  apiPrefix: string
  logLevel: LogLevel
}

export default registerAs<AppConfig>(
  ConfigName.App,
  () =>
    new AppConfig({
      nodeEnv: process.env[Env.App.NodeEnv],
      debug: process.env[Env.App.NodeEnv] !== 'production',
      name: process.env[Env.App.AppName],
      port: parseInt(
        process.env[Env.App.AppPort] || process.env[Env.App.Port] || '3000',
        10,
      ),
      apiPrefix: process.env[Env.App.ApiPrefix],
      logLevel: parseLogLevel(process.env[Env.App.LogLevel]),
    }),
)
