import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export interface WithSlug {
  slug: string
}

export interface WithTimestamps {
  createdAt: Date
  updatedAt: Date
}

export abstract class BaseEntityWithSlug implements WithSlug {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  slug: string
}

export abstract class BaseEntityWithTimestamps implements WithTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export abstract class BaseEntityWithSlugAndTimestamps
  implements WithSlug, WithTimestamps
{
  @PrimaryGeneratedColumn('uuid')
  id: string

  // WithSlug
  @Column()
  slug: string

  // WithTimestamps
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
