import { ChildEntity, JoinColumn, OneToOne } from 'typeorm'

import { Video } from '../videos/video.entity'
import { Asset } from './asset.entity'

@ChildEntity()
export class VideoCover extends Asset {
  @OneToOne(() => Video, (video) => video.cover)
  @JoinColumn({ name: 'owner_id' })
  video: Video
}
