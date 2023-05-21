import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm'

import { BaseEntityWithTimestamps } from '../base.entity'
import { VideoCover } from '../files/video-cover.entity'
import { VideoSample } from '../files/video-sample.entity'
import { Person } from '../people/person.entity'
import { VideoLabel } from './video-label.entity'
import { VideoMaker } from './video-maker.entity'
import { VideoTag } from './video-tag.entity'

export enum VideoType {
  Jav = 'jav',
}

@Entity()
export class Video extends BaseEntityWithTimestamps {
  @Column()
  type: VideoType

  @Column({ unique: true })
  code: string

  @Column({ nullable: true })
  title?: string

  @Column({ nullable: true })
  releaseDate?: Date

  @Column({ nullable: true })
  length?: number

  @ManyToMany(() => Person, (person) => person.directed)
  directors: Person[]

  @ManyToMany(() => Person, (person) => person.starred)
  actors: Person[]

  @ManyToMany(() => VideoTag)
  @JoinTable()
  tags: VideoTag[]

  @ManyToOne(() => VideoLabel, (label) => label.videos)
  label?: VideoLabel

  @ManyToOne(() => VideoMaker, (maker) => maker.videos)
  maker?: VideoMaker

  @OneToOne(() => VideoCover, (videoCover) => videoCover.video)
  cover?: VideoCover

  @OneToMany(() => VideoSample, (videoSample) => videoSample.video)
  samples: VideoCover[]
}
