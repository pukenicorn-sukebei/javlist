import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntityWithSlugAndTimestamps } from '../base.entity'
import { Person } from './person.entity'

@Entity()
export class PersonAlias extends BaseEntityWithSlugAndTimestamps {
  @Column({ unique: true })
  alias: string

  @ManyToOne(() => Person, (person) => person.aliases)
  person: Person
}
