import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius'

import { PornScraperModule } from '@clients/porn-scraper.module'

import configs from '@configs'

import { DatabaseModule } from './database/database.module'
import { GraphqlConfigService } from './graphql/graphql-config.service'
import { HomeModule } from './home/home.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      imports: [DatabaseModule],
      useClass: GraphqlConfigService,
    }),
    PornScraperModule,

    HomeModule,
  ],
})
export class AppModule {}
