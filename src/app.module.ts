import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius'
import { LoggerModule } from 'nestjs-pino'

import { BullConfigService } from '@_config-services/bull-config.service'
import { GraphqlConfigService } from '@_config-services/graphql-config.service'
import Configs from '@_config/index'
import { DatabaseModule } from '@_database/database.module'

import { FilesModule } from './files/files.module'
import { VideosModule } from './videos/videos.module'
import { VideosService } from './videos/videos.service'

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: Configs,
      envFilePath: ['.env', '.env.default'],
    }),
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
    VideosModule.register(),
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      imports: [DatabaseModule, FilesModule, VideosModule.register()],
      useClass: GraphqlConfigService,
      inject: [VideosService],
    }),
  ],
})
export class AppModule {}
