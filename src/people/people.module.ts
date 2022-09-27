import { Module } from '@nestjs/common'

import { DatabaseModule } from '@_database/database.module'

import { PeopleService } from './people.service'

@Module({
  imports: [DatabaseModule],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
