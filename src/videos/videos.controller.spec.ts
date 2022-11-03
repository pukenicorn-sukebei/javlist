import { Test } from '@nestjs/testing'

import { mockFactory } from '@_utils/testing/mocker'

import { VideosController } from './videos.controller'
import { VideosService } from './videos.service'

describe('VideosController', () => {
  let controller: VideosController
  let service: VideosService
  let service2: VideosService

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [VideosService],
      controllers: [VideosController],
    })
      .useMocker(mockFactory)
      .compile()

    controller = await app.get<VideosController>(VideosController)
    service = await app.resolve(VideosService)
    service2 ||= await app.resolve(VideosService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('/:code', () => {
    it('should return correct value', async () => {
      const resp = await controller.getVideo('test', false)

      expect(resp).toBe(null)
      expect(service).toEqual(service2)
    })
    it('asd', () => {
      expect(service).toEqual(service2)
    })
  })
})
