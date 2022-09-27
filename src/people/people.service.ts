import { Injectable } from '@nestjs/common'
import { Person, PrismaClient } from '@prisma/client'

@Injectable()
export class PeopleService {
  constructor(private readonly prisma: PrismaClient) {}

  static readonly INCLUDES = {
    aliases: true,
  }

  async find(aliases: string[]): Promise<Person[]> {
    aliases = aliases.map((x) => x.trim())

    const people = await this.prisma.person.findMany({
      include: PeopleService.INCLUDES,
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
            include: PeopleService.INCLUDES,
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
