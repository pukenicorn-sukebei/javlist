import { registerAs } from '@nestjs/config'

export interface IAppConfig {
  nodeEnv: string
  debug: boolean
  name?: string
  port: number
  apiPrefix: string
}

export default registerAs<IAppConfig>('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  debug: process.env.NODE_ENV !== 'production',
  name: process.env.APP_NAME,
  port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX,
}))
