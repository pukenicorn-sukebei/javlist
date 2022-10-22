import { Env } from '@_enum/env'

import { getNestApp } from './app'

process.env[Env.Swagger.Enabled] = 'true'
process.env[Env.Swagger.FilePath] =
  process.argv[2] || './generated/openapi.json'

void getNestApp().then((app) => app.close())
