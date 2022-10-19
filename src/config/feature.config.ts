import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export class FeatureConfig {
  constructor(data: Partial<FeatureConfig>) {
    Object.assign(this, data)
  }

  crawlerQueueEnabled: boolean
}

export default registerAs<FeatureConfig>(
  ConfigName.Feature,
  () =>
    new FeatureConfig({
      crawlerQueueEnabled: process.env[Env.Feature.CrawlerQueue] === 'true',
    }),
)
