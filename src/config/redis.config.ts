import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export interface IRedisConfig {
  host?: string
  port: number
}

export default registerAs<IRedisConfig>(ConfigName.Redis, () => ({
  host: process.env[Env.Redis.Host],
  port: +process.env[Env.Redis.Port] || 6379,
}))
