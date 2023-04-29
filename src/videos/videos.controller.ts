import { Controller, Get, Param, ParseArrayPipe, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { PaginationDto, PaginationQuery } from '@_utils/dto/pagination.dto'
import { parseOptionalStringArrayOptions } from '@_utils/pipes/options'
import { ParseExistenceBool } from '@_utils/pipes/parse-existence-bool'

import { VideoDto } from './videos.dto'
import { VideosService } from './videos.service'

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get(':code')
  async getVideo(
    @Param('code')
    code: string,
    @Query('force', ParseExistenceBool)
    forceUpdate: boolean,
  ): Promise<VideoDto> {
    return this.videosService
      .findByCode(code, { forceUpdate })
      .then((video) => this.videosService.toDto(video))
  }

  @Get()
  async getVideos(
    @PaginationQuery()
    pagination: PaginationDto,
    @Query('codes', new ParseArrayPipe(parseOptionalStringArrayOptions))
    codes?: string[],
  ): Promise<VideoDto[]> {
    // noinspection ES6MissingAwait
    const videosPromise =
      codes && codes!.length !== 0
        ? this.videosService.findByCodes(codes, pagination)
        : this.videosService.findAll(pagination)

    return videosPromise.then((videos) =>
      Promise.all(videos.map((video) => this.videosService.toDto(video))),
    )
  }
}
