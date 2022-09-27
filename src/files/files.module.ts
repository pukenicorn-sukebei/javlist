import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { DatabaseModule } from '@_database/database.module'

import { S3Module } from '../s3.module'
import { FilesService } from './files.service'

@Module({
  imports: [HttpModule, DatabaseModule, S3Module],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
