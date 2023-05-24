import { BullModule } from '@nestjs/bull'
import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { instanceToPlain } from 'class-transformer'

import { BullConfigService } from '@_config-services/bull-config.service'
import { TypeOrmConfigService } from '@_config-services/typeorm-config.service'
import Configs from '@_config/index'
import { ConfigName } from '@_enum/config'
import { Logger } from '@_logger'

import { LoggerModule } from './logger/logger.module'
import { VideosModule } from './videos/videos.module'

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: Configs,
      envFilePath: ['.env', '.env.dev', '.env.default'],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    VideosModule.register(),
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
