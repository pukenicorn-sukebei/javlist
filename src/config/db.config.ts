import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export class DbConfig {
  constructor(data: Partial<DbConfig>) {
    Object.assign(this, data)
  }

  type: string
  username: string
  password: string
  host: string
  port: number
  name: string
}

export default registerAs<DbConfig>(
  ConfigName.Db,
  () =>
    new DbConfig({
      type: process.env[Env.Db.Type]!,
      username: process.env[Env.Db.Username]!,
      password: process.env[Env.Db.Password]!,
      host: process.env[Env.Db.Host]!,
      port: +process.env[Env.Db.Port]!,
      name: process.env[Env.Db.Name]!,
    }),
)
