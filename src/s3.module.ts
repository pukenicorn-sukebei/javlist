import { S3Client } from '@aws-sdk/client-s3'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { S3Config } from '@_config/s3.config'
import { ConfigName } from '@_enum/config'

@Module({
  providers: [
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const s3Config = configService.get<S3Config>(ConfigName.S3)

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
