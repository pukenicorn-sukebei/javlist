import { registerAs } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'

export class S3Config {
  constructor(data: Partial<S3Config>) {
    Object.assign(this, data)
  }

  accessKey: boolean
  secretKey: boolean
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

export default registerAs<S3Config>(
  ConfigName.S3,
  () =>
    new S3Config({
      accessKey: !!process.env[Env.S3.AccessKey],
      secretKey: !!process.env[Env.S3.SecretKey],
      endpoint: process.env[Env.S3.Endpoint],
      cdnEndpoint: process.env[Env.S3.EndpointCdn],
      region: process.env[Env.S3.Region],
      buckets: {
        asset: {
          name: process.env[Env.S3.Buckets.Asset.Name],
          keyPrefix: process.env[Env.S3.Buckets.Asset.KeyPrefix],
          presignDuration: +(
            process.env[Env.S3.Buckets.Asset.PresignDuration] || 60 * 60
          ),
        },
      },
    }),
)
