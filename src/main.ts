import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'
import DayJS from 'dayjs'
import DayJSUtc from 'dayjs/plugin/utc'

import { IAppConfig } from '@config/app.config'
import { ISwaggerConfig } from '@config/swagger.config'

import { AppModule } from './app.module'
// import { SerializerInterceptor } from './utils/serializer.interceptor'
import validationOptions from './utils/validation-options'

DayJS.extend(DayJSUtc)

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: true,
    },
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  const configService = app.get(ConfigService)
  const appConfig = configService.get<IAppConfig>('app')
  const swaggerConfig = configService.get<ISwaggerConfig>('swagger')

  app.enableShutdownHooks()
  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  })
  app.enableVersioning({
    type: VersioningType.URI,
  })
  // app.useGlobalInterceptors(new SerializerInterceptor())
  app.useGlobalPipes(new ValidationPipe(validationOptions))

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

  await app.listen(appConfig.port)
}
void bootstrap()
