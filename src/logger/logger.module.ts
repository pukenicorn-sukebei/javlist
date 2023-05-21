import { DynamicModule, Module } from '@nestjs/common'

import { Logger } from '@_logger'

import { TypeOrmLogger } from './typeorm-logger'

@Module({
  providers: [Logger, TypeOrmLogger],
  exports: [Logger, TypeOrmLogger],
})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      global: true,
      providers: [Logger, TypeOrmLogger],
      exports: [Logger, TypeOrmLogger],
    }
  }
}
