import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export interface IAppConfig {
  nodeEnv: string
  debug: boolean
  name?: string
  port: number
  apiPrefix: string
}

export default registerAs<IAppConfig>(ConfigName.App, () => ({
  nodeEnv: process.env[Env.App.NodeEnv],
  debug: process.env[Env.App.NodeEnv] !== 'production',
  name: process.env[Env.App.AppName],
  port:
    parseInt(process.env[Env.App.AppPort] || process.env[Env.App.Port], 10) ||
    3000,
  apiPrefix: process.env[Env.App.ApiPrefix],
}))
