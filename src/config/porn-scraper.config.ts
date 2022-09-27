import { registerAs } from '@nestjs/config'

import { Configuration } from '@_clients/porn-scraper'

export default registerAs<Configuration>(
  'porn-scraper-client',
  () =>
    new Configuration({
      basePath: process.env.PORN_SCRAPER_BASEPATH,
    }),
)
