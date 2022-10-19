import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ConfigName } from '@_enum/config'
import {
  Configuration,
  JavScraperService,
} from '@_generated/porn-scraper-client'

import { PornScraperService } from './porn-scraper.service'

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: Configuration,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<Configuration>(ConfigName.PornScraper),
    },
    JavScraperService,
    PornScraperService,
  ],
  exports: [PornScraperService],
})
export class PornScraperModule {}
