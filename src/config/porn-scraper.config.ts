import { Configuration } from '@_generated/porn-scraper-client'
import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export default registerAs<Configuration>(
  ConfigName.PornScraper,
  () =>
    new Configuration({
      basePath: process.env[Env.PornCrawler.BasePath],
    }),
)
