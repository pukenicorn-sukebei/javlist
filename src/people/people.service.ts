import { Injectable } from '@nestjs/common'

import { Person } from '@_models'

import { PeopleRepository } from './people.repository'

@Injectable()
export class PeopleService {
  constructor(private readonly peopleRepository: PeopleRepository) {}

  async findMany(
    aliases: string[],
    opts: { createOnNotFound?: boolean } = {},
  ): Promise<Person[]> {
    return this.peopleRepository.findMany(aliases, opts)
  }
}
