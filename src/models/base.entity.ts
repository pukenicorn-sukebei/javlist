import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { slugify } from '@_utils/slug'

export interface WithSlug {
  slug: string
}

export interface WithTimestamps {
  createdAt: Date
  updatedAt: Date
}

export type WithSlugOptions = {
  fieldToSlug: string
}

export abstract class BaseEntityWithSlug implements WithSlug {
  protected constructor(private readonly opts: WithSlugOptions) {}

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  slug: string

  @BeforeInsert()
  @BeforeUpdate()
  slugify() {
    this.slug = slugify(this[this.opts.fieldToSlug])
  }
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
  protected constructor(private readonly opts: WithSlugOptions) {}

  @PrimaryGeneratedColumn('uuid')
  id: string

  // WithSlug
  @Column()
  slug: string

  @BeforeInsert()
  @BeforeUpdate()
  public slugify() {
    this.slug = slugify(this[this.opts.fieldToSlug])
  }

  // WithTimestamps
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
