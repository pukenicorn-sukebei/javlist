import { BullRootModuleOptions } from '@nestjs/bull/dist/interfaces/bull-module-options.interface'
import { SharedBullConfigurationFactory } from '@nestjs/bull/dist/interfaces/shared-bull-config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IFeatureConfig } from '@_config/feature.config'
import { IRedisConfig } from '@_config/redis.config'
import { ConfigName } from '@_enum/config'

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  private readonly featureConfig: IFeatureConfig
  private readonly redisConfig: IRedisConfig

  constructor(configService: ConfigService) {
    this.featureConfig = configService.get<IFeatureConfig>(ConfigName.Feature)
    this.redisConfig = configService.get<IRedisConfig>(ConfigName.Redis)
  }

  createSharedConfiguration():
    | Promise<BullRootModuleOptions>
    | BullRootModuleOptions {
    return {
      redis: {
        host: this.redisConfig.host,
        port: this.redisConfig.port,
      },
    }
  }
}
