import {
  INestApplication,
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

import { AppConfig } from '@_config/app.config'
import { SwaggerConfig } from '@_config/swagger.config'
import { ConfigName } from '@_enum/config'
import { LogLevel } from '@_enum/log-level'

import { AppModule } from './app.module'
// import { SerializerInterceptor } from './utils/serializer.interceptor'
import validationOptions from './utils/validation-options'

DayJS.extend(DayJS_UTC)

export async function runApp() {
  const app = await getNestApp()

  const appConfig = _getConfig<AppConfig>(app, ConfigName.App)
  await app.listen(appConfig.port, '0.0.0.0')
}

////////////////////////////////////////////////////////////////////////////////

function _getConfig<T>(app: INestApplication, configName: ConfigName): T {
  const configService = app.get(ConfigService)
  return configService.get<T>(configName)
}

////////getNestApp////////////////////////////////////////////////////////////////////////

export async function getNestApp(): Promise<INestApplication> {
  const fastify = getFastifyInstance()
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastify),
    {
      cors: true,
      bufferLogs: true,
    },
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  const appConfig = _getConfig<AppConfig>(app, ConfigName.App)

  app.enableShutdownHooks()
  app.useLogger(getLoggerLogLevel(appConfig))
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

function getLoggerLogLevel(appConfig: AppConfig) {
  const logLevels = []
  // noinspection FallThroughInSwitchStatementJS
  switch (appConfig.logLevel) {
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
      .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup(swaggerConfig.path, app, document)

    if (swaggerConfig.filePath) {
      Fs.writeFileSync(swaggerConfig.filePath, JSON.stringify(document))
    }
  }
}
