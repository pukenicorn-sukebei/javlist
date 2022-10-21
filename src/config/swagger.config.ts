import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export class SwaggerConfig {
  constructor(data: Partial<SwaggerConfig>) {
    Object.assign(this, data)
  }

  enabled: boolean
  path: string
  title: string
  description: string
  version: string
}

export default registerAs<SwaggerConfig>(
  ConfigName.Swagger,
  () =>
    new SwaggerConfig({
      enabled: process.env[Env.Swagger.Enabled]?.toLowerCase() === 'true',
      path: process.env[Env.Swagger.Path] || 'swagger',
      title:
        process.env[Env.Swagger.Name] ||
        process.env[Env.App.AppName] ||
        'title',
      description: process.env[Env.Swagger.Description] || 'description',
      version: '1.0',
    }),
)
