import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { Person, PersonAlias } from '@_models'

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly peopleRepository: Repository<Person>,
    @InjectRepository(PersonAlias)
    private readonly personAliasesRepository: Repository<PersonAlias>,
  ) {}

  static readonly INCLUDES = {
    aliases: true,
  }

  async find(aliases: string[]): Promise<Person[]> {
    aliases = aliases.map((x) => x.trim())

    const people = await this.peopleRepository.find({
      where: {
        aliases: In(aliases),
      },
    })

    const existingPeopleAliases = [...people].flatMap((pp) =>
      pp.aliases.map((a) => a.alias),
    )
    const newPeople = []
    // TODO impl
    // const newPeople = await Promise.all(
    //   aliases
    //     .filter((x) => !existingPeopleAliases.includes(x))
    //     .map((alias) =>
    //       this.prisma.person.create({
    //         include: PeopleService.INCLUDES,
    //         data: {
    //           aliases: {
    //             connectOrCreate: {
    //               create: { alias },
    //               where: { alias },
    //             },
    //           },
    //         },
    //       }),
    //     ),
    // )

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

    let basePerson: Person, migratingPerson: Person

    return true
  }
}
