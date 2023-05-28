import { Column, Entity, TableInheritance, Unique } from 'typeorm'

import { BaseEntityWithTimestamps } from '../base.entity'

@Entity()
@Unique(['type', 'uploadedBucket', 'uploadedPath'])
@TableInheritance({ column: 'type' })
export abstract class Asset extends BaseEntityWithTimestamps {
  protected static readonly JOIN_COLUMN_NAME = 'owner_id'

  @Column()
  readonly type: string

  @Column({ nullable: true })
  originalName?: string

  @Column({ nullable: true })
  originalPath?: string

  @Column({ unique: true })
  uploadedPath: string

  @Column()
  uploadedBucket: string
}
