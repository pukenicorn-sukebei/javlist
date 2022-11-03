import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export class PornScraperConfig {
  constructor(data: Partial<PornScraperConfig>) {
    Object.assign(this, data)
  }

  basePath: string
}

export default registerAs<PornScraperConfig>(
  ConfigName.PornScraper,
  () =>
    new PornScraperConfig({
      basePath: process.env[Env.PornScraper.BasePath],
    }),
)
