import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Person } from '@_generated/prisma'

import { PeopleService } from './people.service'

@ApiTags('people')
@Controller('people')
@UseInterceptors(ClassSerializerInterceptor)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get(':alias')
  async getPerson(
    @Param('alias')
    alias: string,
  ): Promise<Person> {
    // ): Promise<PersonDto> {
    return this.peopleService.findByAlias(alias)
    // .then((person) => this.peopleService.toDto(person))
  }
}
