import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntityWithSlugAndTimestamps } from '../base.entity'
import { Video } from './video.entity'

@Entity()
export class VideoLabel extends BaseEntityWithSlugAndTimestamps {
  constructor() {
    super('name')
  }

  @Column({ unique: true })
  name: string

  @OneToMany(() => Video, (video) => video.label, { cascade: true })
  videos: Video[]
}
