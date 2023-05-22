import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  LookupApi,
  LookupApiFactory,
} from '@pukenicorn-sukebei/porn-scraper-client'

import { PornScraperConfig } from '@_config/porn-scraper.config'
import { ConfigName } from '@_enum/config'

import { PornScraperService } from './porn-scraper.service'

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: LookupApi,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<PornScraperConfig>(
          ConfigName.PornScraper,
        )!
        return LookupApiFactory(undefined, config.basePath)
      },
    },
    PornScraperService,
  ],
  exports: [PornScraperService],
})
export class PornScraperModule {}
