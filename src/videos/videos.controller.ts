import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

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
  async getVideos(@Param('code') code: string): Promise<VideoDto> {
    return this.videosService
      .findByCode(code)
      .then((video) => this.videosService.toDto(video))
  }

  @Get()
  async getVideo(@Query() params: VideosParam): Promise<VideoDto[]> {
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
