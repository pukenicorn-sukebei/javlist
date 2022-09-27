import { S3Client } from '@aws-sdk/client-s3'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IS3Config } from '@_config/s3.config'

@Module({
  providers: [
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const s3Config = configService.get<IS3Config>('s3')

        if (!s3Config.region) {
          throw new Error('S3 region is missing')
        }

        return new S3Client({
          endpoint: s3Config.endpoint,
          region: s3Config.region,
        })
      },
    },
  ],
  exports: [S3Client],
})
export class S3Module {}
