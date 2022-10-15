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
import { ConfigName } from '@_enum/config'
import * as UrlUtils from '@_utils/url'

import { Logger } from '../logger'

export interface IFileUploadMeta {
  originalName?: string
  originalPath?: string
}

// TODO support local file hosting?
@Injectable()
export class FilesService {
  private readonly s3Config: IS3Config

  constructor(
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaClient,
    private readonly s3Client: S3Client,
    configService: ConfigService,
  ) {
    this.logger.setContext(FilesService.name)
    this.s3Config = configService.get<IS3Config>(ConfigName.S3)
  }

  async uploadAssetFromUrl(url: string): Promise<string> {
    return this.uploadFromUrl(
      this.s3Config.buckets.asset.name,
      this.s3Config.buckets.asset.keyPrefix,
      url,
    )
  }

  async getAssetPreSignedUrl(key: string, age?: number): Promise<string> {
    return this.getPreSignedUrl(this.s3Config.buckets.asset.name, key, age)
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
    return this.upload(bucket, key, data, {
      originalName: url.split('/').pop(),
      originalPath: url,
    })
  }

  async upload(
    bucket: string,
    key: string,
    data: PutObjectRequest['Body'] | string | Uint8Array | Buffer,
    { originalName, originalPath }: IFileUploadMeta = {},
  ): Promise<string> {
    this.logger.verbose(`[Upload][${bucket}:${key}] Uploading`)

    await this.s3Client
      .send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: data }))
      .then(() => this.logger.debug(`[Upload][${bucket}:${key}] Done`))
      .catch((err) =>
        this.logger.error(`[Upload][${bucket}:${key}] Failed: ${err}`),
      )

    this.prisma.file
      .create({
        data: {
          originalName,
          originalPath,
          uploadedBucket: bucket,
          uploadedPath: key,
        },
      })
      .catch((err) => {
        this.logger.error(
          `[Upload][${bucket}:${key}] Failed to record to db ${err}`,
        )
      })

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

    const preSignedUrl = await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      {
        expiresIn: age,
      },
    ).then((url) => {
      if (this.s3Config.cdnEndpoint) {
        try {
          return UrlUtils.replaceHost(url, this.s3Config.cdnEndpoint)
        } catch {}
      }
      return url
    })

    await this.cacheManager.set(cacheKey, preSignedUrl, { ttl: age * 0.75 })

    return preSignedUrl
  }

  private async _delete(bucket: string, key: string): Promise<void> {
    this.logger.verbose(`[Delete][${bucket}:${key}] Deleting`)

    await this.s3Client
      .send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
      .then(() => this.logger.debug(`[Delete][${bucket}:${key}] Done`))
      .catch((err) =>
        this.logger.error(`[Delete][${bucket}:${key}] Failed: ${err}`),
      )
  }
}
