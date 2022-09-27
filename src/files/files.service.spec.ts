import { ConfigService } from '@nestjs/config'
import * as UUID from 'uuid'

import { IS3Config } from '@_config/s3.config'
import { createTestingModule } from '@_utils/testing/module'

import { FilesService } from './files.service'

describe('FilesService', () => {
  const sampleUrl =
    'https://pics.dmm.co.jp/mono/movie/adult/ssis527/ssis527pl.jpg'

  let s3Config: IS3Config
  let service: FilesService

  beforeEach(async () => {
    const moduleRef = await createTestingModule({
      providers: {
        modules: [FilesService],
      },
    })

    const configService = moduleRef.get<ConfigService>(ConfigService)
    s3Config = configService.get<IS3Config>('s3')

    service = moduleRef.get<FilesService>(FilesService)
  })

  describe('s3', () => {
    let key: string

    beforeEach(() => {
      key = null
    })
    afterEach(async () => {
      if (key) {
        // @ts-expect-error for cleanup
        await service._delete(s3Config.buckets.asset.name, key)
      }
    })

    it('should upload file to s3', async () => {
      key = await service.uploadFromUrl(
        s3Config.buckets.asset.name,
        s3Config.buckets.asset.keyPrefix,
        sampleUrl,
      )

      const regexp = new RegExp(
        `^${s3Config.buckets.asset.keyPrefix}/([\\w-]+)\\.jpg$`,
      )
      const match = regexp.exec(key)

      expect(match).toBeTruthy()
      expect(UUID.validate(match[1])).toBe(true)
    })

    it('should generate pre-signed url', async () => {
      key = await service.uploadFromUrl(
        s3Config.buckets.asset.name,
        s3Config.buckets.asset.keyPrefix,
        sampleUrl,
      )

      await expect(
        service.getPreSignedUrl(s3Config.buckets.asset.name, key),
      ).resolves.not.toThrowError()
    })
  })
})
