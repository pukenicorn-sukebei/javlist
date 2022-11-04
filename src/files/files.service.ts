import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { PutObjectRequest } from '@aws-sdk/client-s3/dist-types/models/models_0'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { HttpService } from '@nestjs/axios'
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'
import * as Path from 'path'
import * as UUID from 'uuid'

import { S3Config } from '@_config/s3.config'
import { ConfigName } from '@_enum/config'
import { File, FileType, Prisma, PrismaClient } from '@_generated/prisma'
import { Logger } from '@_logger'
import * as UrlUtils from '@_utils/url'

export interface IFileUploadMeta {
  originalName?: string
  originalPath?: string
}

// TODO support local file hosting?
@Injectable()
export class FilesService {
  private readonly s3Config: S3Config

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
    this.s3Config = configService.get<S3Config>(ConfigName.S3)!

    if (
      !this.s3Config.buckets.asset.name ||
      !this.s3Config.buckets.asset.keyPrefix
    ) {
      throw new InternalServerErrorException(
        'S3 Asset bucket name or key prefix is missing',
      )
    }
  }

  async uploadAssetFromUrl(type: FileType, url: string): Promise<File> {
    return this.uploadFromUrl(
      type,
      this.s3Config.buckets.asset.name!,
      this.s3Config.buckets.asset.keyPrefix!,
      url,
    )
  }

  async getAssetPreSignedUrl(key: string, age?: number): Promise<string> {
    return this.getPreSignedUrl(this.s3Config.buckets.asset.name!, key, age)
  }

  async uploadFromUrl(
    type: FileType,
    bucket: string,
    keyPrefix: string,
    url: string,
  ): Promise<File> {
    const data = await this.httpService.axiosRef
      .get(url, { responseType: 'arraybuffer' })
      .then((response) => Buffer.from(response.data, 'binary'))

    const key = Path.posix.join(
      keyPrefix,
      `${UUID.v4()}.${url.split('.').at(-1)}`,
    )
    return this.upload(type, bucket, key, data, {
      originalName: url.split('/').pop(),
      originalPath: url,
    })
  }

  async upload(
    type: FileType,
    bucket: string,
    key: string,
    data: PutObjectRequest['Body'] | string | Uint8Array | Buffer,
    { originalName, originalPath }: IFileUploadMeta = {},
  ): Promise<File> {
    this.logger.verbose(`[Upload][${bucket}:${key}] Uploading`)

    await this.s3Client
      .send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: data }))
      .then(() => this.logger.debug(`[Upload][${bucket}:${key}] Done`))
      .catch((err) => {
        this.logger.error(`[Upload][${bucket}:${key}] Failed: ${err}`)
        throw err
      })

    const params: Prisma.XOR<
      Prisma.FileCreateInput,
      Prisma.FileUncheckedCreateInput
    > = {
      type,
      originalName,
      originalPath,
      uploadedBucket: bucket,
      uploadedPath: key,
    }

    const fileRecordPromise = this.prisma.file.upsert({
      where: { type_uploadedPath: { type, uploadedPath: key } },
      create: params,
      update: params,
    })

    fileRecordPromise.catch((err) =>
      this.logger.error(
        `[Upload][${bucket}:${key}] Failed to record to db ${err}`,
      ),
    )

    return fileRecordPromise
  }

  async getPreSignedUrl(
    bucket: string,
    key: string,
    age: number = 60 * 60,
  ): Promise<string> {
    const cacheKey = `FILES->${bucket}->${key}`

    const cacheRes = await this.cacheManager.get<string>(cacheKey)

    if (cacheRes) {
      return cacheRes
    }

    const preSignedUrl = await getSignedUrl(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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

    await this.prisma.file
      .delete({ where: { uploadedPath: key } })
      .catch((err) =>
        this.logger.error(
          `[Delete][${bucket}:${key}] Failed to remove from db ${err}`,
        ),
      )
  }

  // TODO remove un-binded records
}
