import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { MercuriusDriverConfig } from '@nestjs/mercurius'
import { PrismaClient } from '@prisma/client'

import { IAppConfig } from '@config/app.config'

import { schema } from '../schema'

export interface GraphqlContext {
  prisma: PrismaClient
}

@Injectable()
export class GraphqlConfigService
  implements GqlOptionsFactory<MercuriusDriverConfig>
{
  constructor(
    private configService: ConfigService,
    private prisma: PrismaClient,
  ) {}

  createGqlOptions():
    | Promise<Omit<MercuriusDriverConfig, 'driver'>>
    | Omit<MercuriusDriverConfig, 'driver'> {
    const appConfig = this.configService.get<IAppConfig>('app')

    const context: GraphqlContext = { prisma: this.prisma }

    return {
      schema,
      context,
      // debug: appConfig.debug,
      graphiql: appConfig.debug,
    }
  }
}
