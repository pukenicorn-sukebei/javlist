import { Column, Entity, ManyToMany } from 'typeorm'

import { BaseEntityWithSlug } from '../base.entity'
import { Video } from './video.entity'

@Entity()
export class VideoTag extends BaseEntityWithSlug {
  constructor() {
    super({ fieldToSlug: 'name' })
  }

  @Column({ unique: true })
  name: string

  @ManyToMany(() => Video)
  videos: Video[]
}
