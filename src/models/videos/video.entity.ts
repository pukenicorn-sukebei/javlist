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
  @Column({ type: 'enum', enum: VideoType })
  type: VideoType

  @Column({ unique: true })
  code: string

  @Column({ nullable: true })
  title?: string

  @Column({ nullable: true })
  releaseDate?: Date

  @Column({ nullable: true })
  length?: number

  @ManyToMany(() => Person, (person) => person.directed, {
    cascade: true,
    eager: true,
  })
  directors: Person[]

  @ManyToMany(() => Person, (person) => person.starred, {
    cascade: true,
    eager: true,
  })
  actors: Person[]

  @ManyToMany(() => VideoTag, { cascade: true, eager: true })
  @JoinTable()
  tags: VideoTag[]

  @ManyToOne(() => VideoLabel, (label) => label.videos, {
    cascade: true,
    eager: true,
  })
  label?: VideoLabel

  @ManyToOne(() => VideoMaker, (maker) => maker.videos, {
    cascade: true,
    eager: true,
  })
  maker?: VideoMaker

  @OneToOne(() => VideoCover, (videoCover) => videoCover.video, {
    cascade: true,
    eager: true,
  })
  cover?: VideoCover

  @OneToMany(() => VideoSample, (videoSample) => videoSample.video, {
    cascade: true,
    eager: true,
  })
  samples: VideoSample[]
}
