import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'

import { BaseEntityWithTimestamps } from '../base.entity'
import { Video } from '../videos/video.entity'
import { PersonAlias } from './person-alias.entity'

@Entity()
export class Person extends BaseEntityWithTimestamps {
  constructor(data: Partial<Person> = {}) {
    super()
    Object.assign(this, data)
  }

  @OneToMany(() => PersonAlias, (personAlias) => personAlias.person, {
    eager: true,
    cascade: true,
    orphanedRowAction: 'delete',
  })
  aliases: PersonAlias[]

  @ManyToMany(() => Video, (video) => video.directors)
  @JoinTable()
  directed: Video[]

  @ManyToMany(() => Video, (video) => video.actors)
  @JoinTable()
  starred: Video[]

  private _alias?: string
  get alias(): string {
    if (!this._alias) {
      if (!this.aliases.length) {
        this._alias = '--NO NAME--'
      } else if (this.aliases.length === 1) {
        this._alias = this.aliases[0].alias
      } else {
        const sortedList = this.aliases
          .sort((a, b) => a.createdAt.getDate() - b.createdAt.getDate())
          .map(({ alias }) => alias)
        this._alias = `${sortedList.splice(0, 1)} (${sortedList.join(', ')})`
      }
    }
    return this._alias
  }
}
