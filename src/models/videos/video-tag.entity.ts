import { Column, Entity, ManyToMany } from 'typeorm'

import { BaseEntityWithSlug } from '../base.entity'
import { Video } from './video.entity'

@Entity()
export class VideoTag extends BaseEntityWithSlug {
  constructor(data: Partial<VideoTag> = {}) {
    super('name')
    Object.assign(this, data)
  }

  @Column({ unique: true })
  name: string

  @ManyToMany(() => Video)
  videos: Video[]
}
