import { BullModule } from '@nestjs/bull'
import { DynamicModule, Module } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface'

import { PornScraperModule } from '@_clients/porn-scraper.module'
import { DatabaseModule } from '@_database/database.module'
import { Env } from '@_enum/env'
import { QueueName } from '@_enum/queue'

import { FilesModule } from '../files/files.module'
import { PeopleModule } from '../people/people.module'
import { VideosConsumer } from './videos.consumer'
import { VideosController } from './videos.controller'
import { VideosService } from './videos.service'

interface VideosModuleOptions {
  enableScraperQueue: boolean
}

@Module({})
export class VideosModule {
  private static module: DynamicModule

  static register(): DynamicModule {
    return (
      VideosModule.module ||
      (VideosModule.module = {
        module: VideosModule,
        global: false,
        ...VideosModule.generateModule({
          // TODO try get this from config service
          enableScraperQueue: process.env[Env.Feature.CrawlerQueue] === 'true',
        }),
      })
    )
  }

  private static generateModule(
    { enableScraperQueue = true }: VideosModuleOptions = {} as any,
  ): ModuleMetadata {
    const module: ModuleMetadata = {
      imports: [DatabaseModule, PornScraperModule, FilesModule, PeopleModule],
      controllers: [VideosController],
      providers: [VideosService, VideosConsumer],
      exports: [VideosService],
    }

    if (enableScraperQueue) {
      module.imports!.push(
        BullModule.registerQueue({
          name: QueueName.PornScraper,
          prefix: 'PORN_SCRAPER->',
          limiter: {
            duration: 1000,
            max: 1,
          },
          defaultJobOptions: {
            attempts: 3,
            removeOnComplete: true,
            removeOnFail: true,
          },
        }),
      )
    }

    return module
  }
}
