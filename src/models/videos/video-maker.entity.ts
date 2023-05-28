import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntityWithSlugAndTimestamps } from '../base.entity'
import { Video } from './video.entity'

@Entity()
export class VideoMaker extends BaseEntityWithSlugAndTimestamps {
  constructor() {
    super({ fieldToSlug: 'name' })
  }

  @Column({ unique: true })
  name: string

  @OneToMany(() => Video, (video) => video.maker)
  videos: Video[]
}
