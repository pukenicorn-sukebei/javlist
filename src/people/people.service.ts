import { Injectable } from '@nestjs/common'

import { Person, PrismaClient } from '@_generated/prisma'

import { PeopleDefaultInclude, PersonWithInclude } from './people.dto'

@Injectable()
export class PeopleService {
  constructor(private readonly prisma: PrismaClient) {}

  private normalizeAlias(alias: string) {
    return alias.replace('/[-_]/g', ' ')
  }

  async findByAlias(alias: string): Promise<PersonWithInclude> {
    const normalizedAlias = this.normalizeAlias(alias)
    return this.prisma.person.findFirst({
      include: PeopleDefaultInclude,
      where: {
        aliases: {
          some: { alias: { equals: normalizedAlias, mode: 'insensitive' } },
        },
      },
    })
  }

  async upsertWithAliases(aliases: string[]): Promise<Person[]> {
    aliases = aliases.map((x) => x.trim())

    const people = await this.prisma.person.findMany({
      include: { aliases: true },
      where: {
        aliases: {
          some: {
            alias: { in: aliases },
          },
        },
      },
    })

    const existingPeopleAliases = [...people].flatMap((pp) =>
      pp.aliases.map((a) => a.alias),
    )
    const newPeople = await Promise.all(
      aliases
        .filter((x) => !existingPeopleAliases.includes(x))
        .map((alias) =>
          this.prisma.person.create({
            include: { aliases: true },
            data: {
              aliases: {
                connectOrCreate: {
                  create: { alias },
                  where: { alias },
                },
              },
            },
          }),
        ),
    )

    return [...people, ...newPeople]
  }
}
