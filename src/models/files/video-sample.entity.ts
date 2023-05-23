import { ChildEntity, JoinColumn, ManyToOne } from 'typeorm'

import { Video } from '../videos/video.entity'
import { Asset } from './asset.entity'

@ChildEntity()
export class VideoSample extends Asset {
  constructor(data: Partial<VideoSample> = {}) {
    super()
    Object.assign(this, data)
  }

  @ManyToOne(() => Video, (video) => video.samples)
  @JoinColumn({ name: 'owner_id' })
  video: Video
}
