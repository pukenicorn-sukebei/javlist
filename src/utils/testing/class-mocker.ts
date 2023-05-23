import { getQueueToken } from '@nestjs/bull'
import { MockFactory } from '@nestjs/testing/interfaces'
import { Queue } from 'bull'
import { mockDeep } from 'jest-mock-extended'

import { PornScraperService } from '@_clients/porn-scraper.service'
import { QueueName } from '@_enum/queue'
import { Logger } from '@_logger'

import { FilesService } from '../../files/files.service'
import { PeopleRepository } from '../../people/people.repository'
import { PeopleService } from '../../people/people.service'
import { VideosConsumer } from '../../videos/videos.consumer'
import { VideosRepository } from '../../videos/videos.repository'
import { VideosService } from '../../videos/videos.service'

export const mockFactory: MockFactory = (token) => {
  switch (token) {
    case Logger:
      return mockDeep<Logger>()
    case PornScraperService:
      return mockDeep<PornScraperService>()
    case PeopleService:
      return mockDeep<PeopleService>()
    case PeopleRepository:
      return mockDeep<PeopleRepository>()
    case VideosService:
      return mockDeep<VideosService>()
    case VideosConsumer:
      return mockDeep<VideosConsumer>()
    case VideosRepository:
      return mockDeep<VideosRepository>()
    case FilesService:
      return mockDeep<FilesService>()
    case getQueueToken(QueueName.PornScraper):
      return mockDeep<Queue>()
  }
}
