import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import * as Path from 'path'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { AppConfig } from '@_config/app.config'
import { DbConfig } from '@_config/db.config'
import { ConfigName } from '@_enum/config'
import { TypeOrmLogger } from '@_logger'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private static ACCEPTED_DB_TYPE = ['mssql', 'mysql', 'mariadb', 'postgres']

  private readonly appConfig: AppConfig
  private readonly dbConfig: DbConfig

  constructor(
    private readonly logger: TypeOrmLogger,
    configService: ConfigService,
  ) {
    this.appConfig = configService.get<AppConfig>(ConfigName.App)!
    this.dbConfig = configService.get<DbConfig>(ConfigName.Db)!
  }

  private getBaseOptions(): Partial<TypeOrmModuleOptions> {
    return {
      logger: this.logger,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [Path.join(process.cwd(), '**', '*.entity.{ts|js}')],
      subscribers: [],
      autoLoadEntities: true,
      // subscribers: [],
    }
  }

  private getOptions(): Partial<TypeOrmModuleOptions> {
    const dbType = this.dbConfig.type
    if (!TypeOrmConfigService.ACCEPTED_DB_TYPE.includes(dbType)) {
      throw new Error(
        `Invalid db type specified, got "${dbType}", must be one of ${TypeOrmConfigService.ACCEPTED_DB_TYPE}`,
      )
    }

    let dbPort = this.dbConfig.port
    if (isNaN(dbPort)) {
      switch (dbType) {
        case 'mssql':
          dbPort = 1433
          break
        case 'mysql':
        case 'mariadb':
          dbPort = 3306
          break
        case 'postgres':
          dbPort = 5432
          break
      }
    }

    return {
      type: dbType as 'mssql' | 'mysql' | 'mariadb' | 'postgres',
      host: this.dbConfig.host,
      port: dbPort,
      username: this.dbConfig.username,
      password: this.dbConfig.password,
      database: this.dbConfig.name,
      migrations:
        this.appConfig.appEnv === 'typeorm-cli'
          ? [Path.join(process.cwd(), 'migrations', '*.ts')]
          : undefined,
      namingStrategy: new SnakeNamingStrategy(),
      logger: this.logger,
    }
  }

  private getTestOptions(): Partial<TypeOrmModuleOptions> {
    return {
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      synchronize: true,
    }
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const baseOptions = this.getBaseOptions()
    const envOptions =
      this.appConfig.appEnv === 'test'
        ? this.getTestOptions()
        : this.getOptions()

    return {
      ...baseOptions,
      ...envOptions,
    } as TypeOrmModuleOptions
  }
}
