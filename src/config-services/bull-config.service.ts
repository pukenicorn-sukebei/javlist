import { BullRootModuleOptions } from '@nestjs/bull/dist/interfaces/bull-module-options.interface'
import { SharedBullConfigurationFactory } from '@nestjs/bull/dist/interfaces/shared-bull-config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { FeatureConfig } from '@_config/feature.config'
import { RedisConfig } from '@_config/redis.config'
import { ConfigName } from '@_enum/config'

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  private readonly featureConfig: FeatureConfig
  private readonly redisConfig: RedisConfig

  constructor(configService: ConfigService) {
    this.featureConfig = configService.get<FeatureConfig>(ConfigName.Feature)
    this.redisConfig = configService.get<RedisConfig>(ConfigName.Redis)
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
