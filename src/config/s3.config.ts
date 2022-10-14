import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export interface IS3Config {
  endpoint?: string
  cdnEndpoint?: string
  region?: string
  buckets: {
    asset: {
      name?: string
      keyPrefix?: string
      presignDuration?: number
    }
  }
}

export default registerAs<IS3Config>(ConfigName.S3, () => {
  if (!process.env[Env.S3.AccessKey] || !process.env[Env.S3.SecretKey]) {
    throw new Error('S3 region is missing')
  }

  return {
    endpoint: process.env[Env.S3.Endpoint],
    cdnEndpoint: process.env[Env.S3.EndpointCdn],
    region: process.env[Env.S3.Region],
    buckets: {
      asset: {
        name: process.env[Env.S3.Buckets.Asset.Name],
        keyPrefix: process.env[Env.S3.Buckets.Asset.KeyPrefix],
        presignDuration:
          +process.env[Env.S3.Buckets.Asset.PresignDuration] || 60 * 60,
      },
    },
  }
})
