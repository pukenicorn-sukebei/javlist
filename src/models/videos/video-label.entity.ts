import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntityWithSlugAndTimestamps } from '../base.entity'
import { Video } from './video.entity'

@Entity()
export class VideoLabel extends BaseEntityWithSlugAndTimestamps {
  constructor(data: Partial<VideoLabel> = {}) {
    super('name')
    Object.assign(this, data)
  }

  @Column({ unique: true })
  name: string

  @OneToMany(() => Video, (video) => video.label, { cascade: true })
  videos: Video[]
}
