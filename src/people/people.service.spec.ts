import { DeepMockProxy } from 'jest-mock-extended'

import { createTestingModule } from '@_utils/testing/module'
import { mockVideo, mockVideoDto } from '@_utils/testing/value-mocker'

import { PeopleService } from './people.service'

describe('PeopleService', () => {
  let service: PeopleService
  // let service: DeepMockProxy<VideosService>

  beforeEach(async () => {
    const app = await createTestingModule({
      providers: { modules: [PeopleService] },
    })

    service = await app.get<PeopleService>(PeopleService)
    // service = await app.resolve(VideosService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // describe('/:code', () => {
  //   it('should return correct value', async () => {
  //     const id = 'test'
  //     const video = mockVideo()
  //     const videoDto = mockVideoDto()
  //
  //     service.findByCode.mockImplementation((x) =>
  //       Promise.resolve(x === id ? video : mockVideo()),
  //     )
  //     service.toDto.mockImplementation((x) =>
  //       Promise.resolve(x.id === video.id ? videoDto : mockVideoDto()),
  //     )
  //
  //     const resp = await controller.getVideo('test', false)
  //
  //     expect(resp).toEqual(videoDto)
  //   })
  // })
})
