import { registerAs } from '@nestjs/config'

import { Configuration } from '@clients/porn-scraper'

export default registerAs<Configuration>(
  'porn-scraper',
  () =>
    new Configuration({
      basePath: process.env.PORN_SCRAPER_BASEPATH,
    }),
)
