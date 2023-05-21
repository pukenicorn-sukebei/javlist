import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BaseEntity } from 'typeorm'

import * as Models from '@_models'

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(Models) as any[])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
