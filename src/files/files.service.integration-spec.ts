// import { ConfigService } from '@nestjs/config'
// import { DeepMockProxy } from 'jest-mock-extended'
// import * as UUID from 'uuid'
//
// import { S3Config } from '@_config/s3.config'
// import { ConfigName } from '@_enum/config'
// import { FileType, PrismaClient } from '@_generated/prisma'
// import { BasicCacheProvider } from '@_utils/testing/basic-cache'
// import { createTestingModule } from '@_utils/testing/module'
// import { mockFile } from '@_utils/testing/value-mocker'
//
// import { S3Module } from '../s3.module'
// import { FilesService } from './files.service'
//
describe('FilesService', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  it('', () => {})
  //   const sampleUrl =
  //     'https://pics.dmm.co.jp/mono/movie/adult/ssis527/ssis527pl.jpg'
  //
  //   let s3Config: S3Config
  //   let service: FilesService
  //   let prisma: DeepMockProxy<PrismaClient>
  //
  //   beforeEach(async () => {
  //     const moduleRef = await createTestingModule({
  //       imports: { modules: [S3Module] },
  //       providers: { modules: [BasicCacheProvider, FilesService] },
  //     })
  //
  //     const configService = moduleRef.get<ConfigService>(ConfigService)
  //     s3Config = configService.get<S3Config>(ConfigName.S3)!
  //
  //     service = await moduleRef.get<FilesService>(FilesService)
  //     prisma = await moduleRef.resolve(PrismaClient)
  //   })
  //
  //   describe('s3', () => {
  //     let key: string | null
  //
  //     beforeEach(() => {
  //       key = null
  //
  //       const _file = mockFile({
  //         uploadedPathPrefix: s3Config.buckets.asset.keyPrefix!,
  //       })
  //
  //       prisma.file.upsert.mockResolvedValue(_file)
  //       prisma.file.delete.mockResolvedValue(_file)
  //     })
  //
  //     afterEach(async () => {
  //       if (key) {
  //         // @ts-expect-error for cleanup
  //         await service._delete(s3Config.buckets.asset.name, key)
  //       }
  //     })
  //
  //     it('should upload file to s3', async () => {
  //       const result = await service.uploadFromUrl(
  //         FileType.VideoCover,
  //         s3Config.buckets.asset.name!,
  //         s3Config.buckets.asset.keyPrefix!,
  //         sampleUrl,
  //       )
  //       key = result.uploadedPath
  //
  //       const regexp = new RegExp(
  //         `^${s3Config.buckets.asset.keyPrefix!}/([\\w-]+)\\.jpg$`,
  //       )
  //       const match = regexp.exec(key)
  //
  //       expect(match).toBeTruthy()
  //       expect(UUID.validate(match![1])).toBe(true)
  //     })
  //
  //     it('should generate pre-signed url', async () => {
  //       const result = await service.uploadFromUrl(
  //         FileType.VideoCover,
  //         s3Config.buckets.asset.name!,
  //         s3Config.buckets.asset.keyPrefix!,
  //         sampleUrl,
  //       )
  //       key = result.uploadedPath
  //
  //       await expect(
  //         service.getPreSignedUrl(s3Config.buckets.asset.name!, key),
  //       ).resolves.not.toThrowError()
  //     })
  //   })
})
