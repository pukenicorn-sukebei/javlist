import { DeepMockProxy } from 'jest-mock-extended'

import { createTestingModule } from '@_utils/testing/module'
import {
  mockVideoDto,
  mockVideoWithInclude,
} from '@_utils/testing/value-mocker'

import { VideosController } from './videos.controller'
import { VideosService } from './videos.service'

describe('VideosController', () => {
  let controller: VideosController
  let service: DeepMockProxy<VideosService>

  beforeEach(async () => {
    const app = await createTestingModule({
      controllers: { modules: [VideosController] },
    })

    controller = await app.get<VideosController>(VideosController)
    service = await app.resolve(VideosService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('/:code', () => {
    it('should return correct value', async () => {
      const id = 'test'
      const video = mockVideoWithInclude()
      const videoDto = mockVideoDto()

      service.findByCode.mockImplementation((x) =>
        Promise.resolve(x === id ? video : mockVideoWithInclude()),
      )
      service.toDto.mockImplementation((x) =>
        Promise.resolve(x.id === video.id ? videoDto : mockVideoDto()),
      )

      const resp = await controller.getVideo('test', false)

      expect(resp).toEqual(videoDto)
    })
  })
})
