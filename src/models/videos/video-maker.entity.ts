import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntityWithSlugAndTimestamps } from '../base.entity'
import { Video } from './video.entity'

@Entity()
export class VideoMaker extends BaseEntityWithSlugAndTimestamps {
  constructor(data: Partial<VideoMaker> = {}) {
    super('name')
    Object.assign(this, data)
  }

  @Column({ unique: true })
  name: string

  @OneToMany(() => Video, (video) => video.maker)
  videos: Video[]
}
