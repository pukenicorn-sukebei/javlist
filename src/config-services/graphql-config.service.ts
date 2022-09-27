import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { MercuriusDriverConfig } from '@nestjs/mercurius'
import { PrismaClient } from '@prisma/client'

import { IAppConfig } from '@_config/app.config'

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
  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
    private readonly videoService: VideosService,
    private readonly prisma: PrismaClient,
  ) {}

  createGqlOptions():
    | Promise<Omit<MercuriusDriverConfig, 'driver'>>
    | Omit<MercuriusDriverConfig, 'driver'> {
    const appConfig = this.configService.get<IAppConfig>('app')

    const context: GraphqlContext = {
      filesService: this.filesService,
      videoService: this.videoService,
      prisma: this.prisma,
    }

    return {
      schema,
      context,
      useGlobalPrefix: true,
      // debug: appConfig.debug,
      graphiql: appConfig.debug,
    }
  }
}
