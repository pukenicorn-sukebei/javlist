import { Module } from '@nestjs/common'

import { DatabaseModule } from '@_database/database.module'

import { PeopleRepository } from './people.repository'
import { PeopleService } from './people.service'

@Module({
  imports: [DatabaseModule],
  providers: [PeopleService, PeopleRepository],
  exports: [PeopleService, PeopleRepository],
})
export class PeopleModule {}
