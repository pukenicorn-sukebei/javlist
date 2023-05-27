import { ChildEntity, JoinColumn, ManyToOne } from 'typeorm'

import { Video } from '../videos/video.entity'
import { Asset } from './asset.entity'

@ChildEntity()
export class VideoSample extends Asset {
  @ManyToOne(() => Video, (video) => video.samples)
  @JoinColumn({ name: 'owner_id' })
  video: Video
}
