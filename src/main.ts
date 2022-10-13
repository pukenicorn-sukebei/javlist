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

import { IAppConfig } from '@_config/app.config'
import { ISwaggerConfig } from '@_config/swagger.config'

import { AppModule } from './app.module'
// import { SerializerInterceptor } from './utils/serializer.interceptor'
import validationOptions from './utils/validation-options'

DayJS.extend(DayJS_UTC)

async function bootstrap() {
  const fastify = getFastifyInstance()
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastify),
    {
      cors: true,
    },
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  const configService = app.get(ConfigService)
  const appConfig = configService.get<IAppConfig>('app')
  const swaggerConfig = configService.get<ISwaggerConfig>('swagger')

  app.enableShutdownHooks()
  app.setGlobalPrefix(configService.get('app.apiPrefix'))
  app.enableVersioning({
    type: VersioningType.URI,
  })
  // app.useGlobalInterceptors(new SerializerInterceptor())
  app.useGlobalPipes(new ValidationPipe(validationOptions))

  setupSwagger(app, swaggerConfig)

  await app.listen(appConfig.port, '0.0.0.0')
}

void bootstrap()

function getFastifyInstance(): FastifyInstance {
  const fastify = Fastify()

  // https://hackerone.com/bugs?report_id=1715536&subject=fastify
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const badNames = Object.getOwnPropertyNames({}.__proto__)
  fastify.addHook('onRequest', async (req, reply) => {
    for (const badName of badNames) {
      if (req.headers['content-type'].indexOf(badName) > -1) {
        void reply.code(415)
        throw new Error('Content type not supported')
      }
    }
  })

  return fastify
}

function setupSwagger(
  app: INestApplication,
  swaggerConfig: ISwaggerConfig,
): void {
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup(swaggerConfig.path, app, document)
  }
}
