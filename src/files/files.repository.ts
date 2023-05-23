import { InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Asset, VideoCover, VideoSample } from '@_models'

import { FileType } from './file-type.enum'

export class FilesRepository {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(VideoCover)
    private readonly videoCoverRepository: Repository<VideoCover>,
    @InjectRepository(VideoSample)
    private readonly videoSampleRepository: Repository<VideoSample>,
  ) {}

  async add(
    type: FileType,
    asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'type'>,
  ): Promise<Asset> {
    switch (type) {
      case FileType.Asset: {
        const obj = this.assetRepository.create(asset)
        return this.assetRepository.save(obj)
      }
      case FileType.VideoCover: {
        const obj = this.videoCoverRepository.create(asset)
        return this.videoCoverRepository.save(obj)
      }
      case FileType.VideoSample: {
        const obj = this.videoSampleRepository.create(asset)
        return this.videoSampleRepository.save(obj)
      }
      default:
        throw new InternalServerErrorException(`Invalid FileType; Got: ${type}`)
    }
  }

  async deleteByKey(key: string) {
    return this.assetRepository.delete({ uploadedPath: key })
  }

  async _list(): Promise<Asset[]> {
    return this.assetRepository.find()
  }

  async _listOrphans(): Promise<Asset[]> {
    const res = await Promise.all([
      this.videoCoverRepository
        .find({ relations: { video: true } })
        .then((covers) => covers.filter((vc) => !vc.video)),
      this.videoSampleRepository
        .find({ relations: { video: true } })
        .then((covers) => covers.filter((vc) => !vc.video)),
    ])

    return res.flatMap((x) => x)
  }
}
