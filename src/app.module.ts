import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius'

import { GraphqlConfigService } from '@_config-services/graphql-config.service'
import Configs from '@_config/index'
import { DatabaseModule } from '@_database/database.module'

import { FilesModule } from './files/files.module'
import { VideosModule } from './videos/videos.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: Configs,
      envFilePath: ['.env', '.env.default'],
    }),
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      imports: [DatabaseModule, FilesModule, VideosModule],
      useClass: GraphqlConfigService,
    }),
  ],
})
export class AppModule {}
