import { BullModule } from '@nestjs/bull'
import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius'
import { instanceToPlain } from 'class-transformer'

import { BullConfigService } from '@_config-services/bull-config.service'
import { GraphqlConfigService } from '@_config-services/graphql-config.service'
import Configs from '@_config/index'
import { DatabaseModule } from '@_database/database.module'
import { ConfigName } from '@_enum/config'
import { Logger } from '@_logger'

import { FilesModule } from './files/files.module'
import { LoggerModule } from './logger/logger.module'
import { VideosModule } from './videos/videos.module'
import { VideosService } from './videos/videos.service'

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: Configs,
      envFilePath: ['.env', '.env.dev', '.env.default'],
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
export class AppModule implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    logger.setContext(AppModule.name)
  }

  onModuleInit(): any {
    let config: unknown, configEnum: string
    for (configEnum in ConfigName) {
      config = this.configService.get(ConfigName[configEnum])
      this.logger.debug(
        `[Config] ${configEnum}: ${JSON.stringify(instanceToPlain(config))}`,
      )
    }
  }
}
