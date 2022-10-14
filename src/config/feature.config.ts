import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export interface IFeatureConfig {
  crawlerQueueEnabled: boolean
}

export default registerAs<IFeatureConfig>(ConfigName.Feature, () => ({
  crawlerQueueEnabled: process.env[Env.Feature.CrawlerQueue] === 'true',
}))
