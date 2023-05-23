import { Injectable } from '@nestjs/common'
import { AbstractLogger, LogLevel, LogMessage, QueryRunner } from 'typeorm'

import { Logger } from './logger'

@Injectable()
export class TypeOrmLogger extends AbstractLogger {
  constructor(private readonly logger: Logger) {
    super()
    logger.setContext('TypeOrm')
  }

  protected writeLog(
    level: LogLevel,
    message: LogMessage | string | number | (LogMessage | string | number)[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryRunner?: QueryRunner,
  ): void {
    const messages = this.prepareLogMessages(message, {
      highlightSql: false,
    })

    for (const message of messages) {
      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          if (message.prefix) {
            this.logger.log(message.prefix, message.message)
          } else {
            this.logger.log(message.message)
          }
          break

        case 'info':
        case 'query':
          if (message.prefix) {
            this.logger.debug(message.prefix, message.message)
          } else {
            this.logger.debug(message.message)
          }
          break

        case 'warn':
        case 'query-slow':
          if (message.prefix) {
            this.logger.warn(message.prefix, message.message)
          } else {
            this.logger.warn(message.message)
          }
          break

        case 'error':
        case 'query-error':
          if (message.prefix) {
            this.logger.error(message.prefix, message.message)
          } else {
            this.logger.error(message.message)
          }
          break
      }
    }
  }
}
