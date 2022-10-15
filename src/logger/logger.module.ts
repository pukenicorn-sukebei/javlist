import { DynamicModule, Module } from '@nestjs/common'

import { Logger } from '@_logger'

@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      global: true,
      providers: [Logger],
      exports: [Logger],
    }
  }
}
