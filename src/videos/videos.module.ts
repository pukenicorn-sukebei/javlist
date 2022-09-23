import { Module } from '@nestjs/common'

import { PornScraperModule } from '@clients/porn-scraper.module'

import { DatabaseModule } from '../database/database.module'
import { VideosService } from './videos.service'

@Module({
  imports: [DatabaseModule, PornScraperModule],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
