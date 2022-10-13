import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ParseExistenceBool } from '@_utils/pipes/parse-existence-bool'
import { IPaginationOptions } from '@_utils/types/pagination-options'

import { VideoDto } from './videos.dto'
import { VideosService } from './videos.service'

interface VideosParam extends IPaginationOptions {
  codes?: string[]
}

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get(':code')
  async getVideo(
    @Param('code') code: string,
    @Query('force', ParseExistenceBool) forceUpdate: boolean,
  ): Promise<VideoDto> {
    return this.videosService
      .findByCode(code, { forceUpdate })
      .then((video) => this.videosService.toDto(video))
  }

  @Get()
  async getVideos(@Query() params: VideosParam): Promise<VideoDto[]> {
    return this.videosService
      .findAll(params.codes, {
        amount: params.amount,
        page: params.page,
      })
      .then((videos) =>
        Promise.all(videos.map((video) => this.videosService.toDto(video))),
      )
  }
}
