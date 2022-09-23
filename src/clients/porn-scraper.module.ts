import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { Configuration, JavScraperService } from '@clients/porn-scraper'

import pornScraperConfig from '@config/porn-scraper.config'

@Module({
  imports: [HttpModule],
  providers: [
    { provide: Configuration, useValue: pornScraperConfig },
    JavScraperService,
  ],
  exports: [JavScraperService],
})
export class PornScraperModule {}
