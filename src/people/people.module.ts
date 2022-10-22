import { Module } from '@nestjs/common'

import { DatabaseModule } from '@_database/database.module'

import { PeopleController } from './people.controller'
import { PeopleService } from './people.service'

@Module({
  imports: [DatabaseModule],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
