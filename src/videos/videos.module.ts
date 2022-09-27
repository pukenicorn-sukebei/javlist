import { Module } from '@nestjs/common'

import { PornScraperModule } from '@_clients/porn-scraper.module'
import { DatabaseModule } from '@_database/database.module'

import { FilesModule } from '../files/files.module'
import { PeopleModule } from '../people/people.module'
import { VideosController } from './videos.controller'
import { VideosService } from './videos.service'

@Module({
  imports: [DatabaseModule, PornScraperModule, FilesModule, PeopleModule],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
