import { Injectable } from '@nestjs/common'
import {
  Person,
  PrismaClient,
  Video,
  VideoInclude,
  VideoLabel,
  VideoMaker,
} from '@prisma/client'
import DayJS from 'dayjs'
import { lastValueFrom } from 'rxjs'

import { JavScraperService } from '@clients/porn-scraper'

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaClient,
    private pornScraperService: JavScraperService,
  ) {}

  static readonly INCLUDES: VideoInclude = {
    label: true,
    maker: true,
    directors: {
      include: {
        person: {
          include: { aliases: true },
        },
      },
    },
    actors: {
      include: {
        person: {
          include: { aliases: true },
        },
      },
    },
    tags: true,
  }

  async findOne(code: string, { forceUpdate = false } = {}): Promise<Video> {
    const video = await this.prisma.video.findFirst({
      include: VideosService.INCLUDES,
      where: { code },
    })
    if (!forceUpdate && video) {
      return video
    }

    return this._fetchVideoFromScraper(code)
  }

  // todo WIP
  private async _fetchVideoFromScraper(code: string): Promise<Video> {
    const scraperResult = await lastValueFrom(
      this.pornScraperService.lookupJavCodeGet(code),
    )

    const data = scraperResult.data

    const label = await this._getOrCreateLabel('data')
    const maker = await this._getOrCreateMaker(data.studio)

    const releaseDate = data.release_date
      ? DayJS.utc(data.release_date).toDate()
      : undefined

    return this.prisma.video.upsert({
      include: VideosService.INCLUDES,
      create: {
        code: data.code,
        name: data.name,
        releaseDate,
        length: 0,
        label: null,
        maker: {
          connectOrCreate: {
            create: { name: data.studio },
            where: { name: data.studio },
          },
        },
        directors: <Person>[],
        actors: {
          connectOrCreate: data.actresses.map((actress) => ({
            create: {
              person: {
                aliases: { alias: actress },
              },
            },
            where: {
              person: {
                aliases: { alias: actress },
              },
            },
          })),
        },
        tags: {
          connectOrCreate: data.genres.map((tag) => ({
            create: { name: tag },
            where: { name: tag },
          })),
        },
      },
      update: {
        code: data.code,
        name: data.name,
        releaseDate,
        length: 0,
        label,
        maker,
        directors: [],
        actors: [],
        tags,
      },
    })
  }

  private async _getOrCreateLabel(name: string): Promise<VideoLabel> {
    const label = await this.prisma.videoLabel.findFirst({ where: { name } })
    return label || this.prisma.videoLabel.create({ data: { name } })
  }

  private async _getOrCreateMaker(name: string): Promise<VideoMaker> {
    return null

    // const label = await this.prisma.videoMaker.findFirst({ where: { name } })
    // return label || this.prisma.videoMaker.create({ data: { name } })
  }
}
