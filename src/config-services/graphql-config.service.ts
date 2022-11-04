import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { MercuriusDriverConfig } from '@nestjs/mercurius'

import { AppConfig } from '@_config/app.config'
import { ConfigName } from '@_enum/config'
import { PrismaClient } from '@_generated/prisma'

import { FilesService } from '../files/files.service'
import { schema } from '../schema'
import { VideosService } from '../videos/videos.service'

export interface GraphqlContext {
  prisma: PrismaClient
  filesService: FilesService
  videoService: VideosService
}

@Injectable()
export class GraphqlConfigService
  implements GqlOptionsFactory<MercuriusDriverConfig>
{
  private readonly appConfig: AppConfig

  constructor(
    configService: ConfigService,
    private readonly filesService: FilesService,
    private readonly videoService: VideosService,
    private readonly prisma: PrismaClient,
  ) {
    this.appConfig = configService.get<AppConfig>(ConfigName.App)!
  }

  createGqlOptions():
    | Promise<Omit<MercuriusDriverConfig, 'driver'>>
    | Omit<MercuriusDriverConfig, 'driver'> {
    const context: GraphqlContext = {
      filesService: this.filesService,
      videoService: this.videoService,
      prisma: this.prisma,
    }

    return {
      schema,
      context,
      useGlobalPrefix: true,
      // debug: this.appConfig.debug,
      graphiql: this.appConfig.debug,
    }
  }
}
