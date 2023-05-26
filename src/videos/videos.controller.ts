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
    @Query('actors', new ParseArrayPipe(parseOptionalStringArrayOptions))
    actors?: string[],
    @Query('directors', new ParseArrayPipe(parseOptionalStringArrayOptions))
    directors?: string[],
    @Query('tags', new ParseArrayPipe(parseOptionalStringArrayOptions))
    tags?: string[],
    @Query('makers', new ParseArrayPipe(parseOptionalStringArrayOptions))
    makers?: string[],
    @Query('labels', new ParseArrayPipe(parseOptionalStringArrayOptions))
    labels?: string[],
  ): Promise<VideoDto[]> {
    // noinspection ES6MissingAwait
    const videos = await this.videosService.getVideos(
      { codes, actors, directors, tags, makers, labels },
      pagination,
    )

    return Promise.all(videos.map((video) => this.videosService.toDto(video)))
  }
}
