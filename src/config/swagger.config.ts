import { registerAs } from '@nestjs/config'

export interface ISwaggerConfig {
  enabled: boolean
  path: string
  title: string
  description: string
  version: string
}

export default registerAs<ISwaggerConfig>('swagger', () => ({
  enabled: process.env.SWAGGER_ENABLED?.toLowerCase() === 'true',
  path: process.env.SWAGGER_PATH || 'swagger',
  title: process.env.SWAGGER_NAME || process.env.APP_NAME || 'title',
  description: process.env.SWAGGER_DESCRIPTION || 'description',
  version: '1.0',
}))
