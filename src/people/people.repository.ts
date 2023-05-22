import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { Person, PersonAlias } from '@_models'

@Injectable()
export class PeopleRepository {
  constructor(
    @InjectRepository(Person)
    private readonly peopleRepository: Repository<Person>,
    @InjectRepository(PersonAlias)
    private readonly personAliasesRepository: Repository<PersonAlias>,
  ) {}

  async findMany(
    aliases: string[],
    opts: { createOnNotFound?: boolean } = {},
  ): Promise<Person[]> {
    aliases = aliases.map((x) => x.trim())

    const people = await this.peopleRepository.find({
      where: {
        aliases: { alias: In(aliases) },
      },
    })

    if (!opts.createOnNotFound) {
      return people
    }

    const existingPeopleAliases = people.flatMap((pp) =>
      pp.aliases.map((a) => a.alias),
    )

    const newPeopleAliases = this.personAliasesRepository.create(
      aliases
        .filter((alias) => !existingPeopleAliases.includes(alias))
        .map((alias) => ({ alias })),
    )

    const newPeople = this.peopleRepository.create(
      newPeopleAliases.map((alias) => ({ aliases: [alias] })),
    )

    await this.peopleRepository.save(newPeople)

    return [...people, ...newPeople]
  }

  async combineByAliases(alias1: string, alias2: string): Promise<boolean> {
    const queryRes = await this.personAliasesRepository
      .findBy([{ alias: alias1 }, { alias: alias2 }])
      .then((res) =>
        res.reduce((acc, cur) => ({ ...acc, [cur.alias]: cur }), {}),
      )

    const pa1 = queryRes[alias1]
    const pa2 = queryRes[alias2]
    if (!pa1 || !pa2) {
      throw new Error('One of the aliases does not exist')
    }

    // let basePerson: Person, migratingPerson: Person

    return true
  }
}
