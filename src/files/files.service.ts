import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { PutObjectRequest } from '@aws-sdk/client-s3/dist-types/models/models_0'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { HttpService } from '@nestjs/axios'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { Cache } from 'cache-manager'
import * as Path from 'path'
import * as UUID from 'uuid'

import { IS3Config } from '@_config/s3.config'

@Injectable()
export class FilesService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaClient,
    private readonly s3Client: S3Client,
  ) {}

  async uploadAssetFromUrl(url: string): Promise<string> {
    const config = this.configService.get<IS3Config>('s3')
    return this.uploadFromUrl(
      config.buckets.asset.name,
      config.buckets.asset.keyPrefix,
      url,
    )
  }
  async getAssetPreSignedUrl(key: string, age?: number): Promise<string> {
    const config = this.configService.get<IS3Config>('s3')
    return this.getPreSignedUrl(config.buckets.asset.name, key, age)
  }

  async uploadFromUrl(
    bucket: string,
    keyPrefix: string,
    url: string,
  ): Promise<string> {
    const data = await this.httpService.axiosRef
      .get(url, { responseType: 'arraybuffer' })
      .then((response) => Buffer.from(response.data, 'binary'))

    const key = Path.posix.join(
      keyPrefix,
      `${UUID.v4()}.${url.split('.').at(-1)}`,
    )
    return this.upload(bucket, key, data)
  }

  async upload(
    bucket: string,
    key: string,
    data: PutObjectRequest['Body'] | string | Uint8Array | Buffer,
  ): Promise<string> {
    // TODO save entry to db
    await this.s3Client.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: data }),
    )

    return key
  }

  async getPreSignedUrl(
    bucket: string,
    key: string,
    age?: number,
  ): Promise<string> {
    const cacheKey = `FILES->${bucket}->${key}`

    const cacheRes = await this.cacheManager.get<string>(cacheKey)

    if (cacheRes) {
      return cacheRes
    }

    // TODO return cdn url from env if set
    const preSignedUrl = await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      {
        expiresIn: age,
      },
    )

    await this.cacheManager.set(cacheKey, preSignedUrl, { ttl: age * 0.75 })

    return preSignedUrl
  }

  private async _delete(bucket: string, key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: key }),
    )
  }
}
