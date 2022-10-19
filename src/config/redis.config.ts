import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export class RedisConfig {
  constructor(data: Partial<RedisConfig>) {
    Object.assign(this, data)
  }

  host?: string
  port: number
}

export default registerAs<RedisConfig>(
  ConfigName.Redis,
  () =>
    new RedisConfig({
      host: process.env[Env.Redis.Host],
      port: +process.env[Env.Redis.Port] || 6379,
    }),
)
