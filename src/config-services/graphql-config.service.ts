import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { MercuriusDriverConfig } from '@nestjs/mercurius'

import { AppConfig } from '@_config/app.config'
import { ConfigName } from '@_enum/config'

import { FilesService } from '../files/files.service'
import { VideosService } from '../videos/videos.service'

export interface GraphqlContext {
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
  ) {
    this.appConfig = configService.get<AppConfig>(ConfigName.App)!
  }

  createGqlOptions():
    | Promise<Omit<MercuriusDriverConfig, 'driver'>>
    | Omit<MercuriusDriverConfig, 'driver'> {
    const context: GraphqlContext = {
      filesService: this.filesService,
      videoService: this.videoService,
    }

    return {
      // schema,
      context,
      useGlobalPrefix: true,
      // debug: this.appConfig.debug,
      graphiql: this.appConfig.debug,
    }
  }
}
