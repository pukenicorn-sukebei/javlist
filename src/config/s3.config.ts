import { registerAs } from '@nestjs/config'

export interface IS3Config {
  endpoint?: string
  region?: string
  buckets: {
    asset: {
      name?: string
      keyPrefix?: string
      presignDuration?: number
    }
  }
}

export default registerAs<IS3Config>('s3', () => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('S3 region is missing')
  }

  return {
    endpoint: process.env.AWS_S3_ENDPOINT,
    region: process.env.AWS_S3_REGION,
    buckets: {
      asset: {
        name: process.env.AWS_S3_BUCKET_ASSET,
        keyPrefix: process.env.AWS_S3_BUCKET_ASSET_KEY_PREFIX,
        presignDuration:
          +process.env.AWS_S3_BUCKET_ASSET_PRESIGN_DURATION || 60 * 60,
      },
    },
  }
})
