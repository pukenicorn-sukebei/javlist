import {
  INestApplication,
  InternalServerErrorException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'
import * as DayJS from 'dayjs'
import * as DayJS_UTC from 'dayjs/plugin/utc'
import Fastify from 'fastify'
import { FastifyInstance } from 'fastify/types/instance'
import * as Fs from 'fs'
import * as Yaml from 'js-yaml'
import * as Path from 'path'
import * as process from 'process'

import { AppConfig } from '@_config/app.config'
import { SwaggerConfig } from '@_config/swagger.config'
import { ConfigName } from '@_enum/config'
import { Env } from '@_enum/env'
import { LogLevel } from '@_enum/log-level'
import { Logger } from '@_logger'

import { AppModule } from './app.module'
// import { SerializerInterceptor } from './utils/serializer.interceptor'
import validationOptions from './utils/validation-options'

DayJS.extend(DayJS_UTC)

const logger = new Logger()
logger.setContext('app.ts')

export async function runApp() {
  logger.log('Initializing')
  const app = await getNestApp()

  const appConfig = _getConfig<AppConfig>(app, ConfigName.App)
  logger.log('Start listening')
  await app.listen(appConfig.port, '0.0.0.0')
}

////////////////////////////////////////////////////////////////////////////////

function _getConfig<T>(app: INestApplication, configName: ConfigName): T {
  const configService = app.get(ConfigService)
  const config = configService.get<T>(configName)
  if (config) {
    return config
  } else {
    throw new InternalServerErrorException(`Config not found: ${configName}`)
  }
}

////////getNestApp////////////////////////////////////////////////////////////////////////

export async function getNestApp(): Promise<INestApplication> {
  logger.log(`AppEnv is: ${process.env[Env.App.AppEnv]}`)

  logger.log('Initializing fastify')
  const fastify = getFastifyInstance()
  logger.log('Initializing nestjs')
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastify),
    {
      cors: true,
      bufferLogs: true,
    },
  )
  logger.log('Setting up container')
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  const appConfig = _getConfig<AppConfig>(app, ConfigName.App)

  const logLevel = appConfig.logLevel || LogLevel.Log
  logger.log(`Log level is: ${logLevel}`)

  app.useLogger(getLoggerLogLevel(appConfig.logLevel))
  app.setGlobalPrefix(appConfig.apiPrefix)
  app.enableVersioning({
    type: VersioningType.URI,
  })
  // app.useGlobalInterceptors(new SerializerInterceptor())
  app.useGlobalPipes(new ValidationPipe(validationOptions))

  setupSwagger(app)

  return app
}

function getFastifyInstance(): FastifyInstance {
  return Fastify()
}

function getLoggerLogLevel(logLevel: LogLevel) {
  const logLevels: LogLevel[] = []
  // noinspection FallThroughInSwitchStatementJS
  switch (logLevel) {
    case LogLevel.Verbose:
      logLevels.push(LogLevel.Verbose)
    case LogLevel.Debug:
      logLevels.push(LogLevel.Debug)
    case LogLevel.Log:
      logLevels.push(LogLevel.Log)
    case LogLevel.Warn:
      logLevels.push(LogLevel.Warn)
    case LogLevel.Error:
      logLevels.push(LogLevel.Error)
  }
  return logLevels
}

function setupSwagger(app: INestApplication): void {
  const swaggerConfig = _getConfig<SwaggerConfig>(app, ConfigName.Swagger)

  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      // .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup(swaggerConfig.path, app, document)

    if (swaggerConfig.filePath) {
      const dirPath = Path.dirname(swaggerConfig.filePath)
      Fs.mkdirSync(dirPath, { recursive: true })

      Fs.writeFileSync(swaggerConfig.filePath, Yaml.dump(document))
    }
  }
}
