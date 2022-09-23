import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PornScraperModule } from '@clients/porn-scraper.module'

import { HomeController } from './home.controller'
import { HomeService } from './home.service'

@Module({
  imports: [ConfigModule, PornScraperModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
