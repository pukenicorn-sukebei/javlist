import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Configuration, JavScraperService } from '@_clients/porn-scraper'
import { PornScraperService } from '@_clients/porn-scraper.service'
import pornScraperConfig from '@_config/porn-scraper.config'
import { ISwaggerConfig } from '@_config/swagger.config'

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: Configuration,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<Configuration>('porn-scraper-client'),
    },
    JavScraperService,
    PornScraperService,
  ],
  exports: [PornScraperService],
})
export class PornScraperModule {}
