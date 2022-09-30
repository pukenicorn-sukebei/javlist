import { Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import * as DayJS from 'dayjs'

import { PornScraperService } from '@_clients/porn-scraper.service'
import { stringifyAliases } from '@_utils/alias'
import { IPaginationOptions } from '@_utils/types/pagination-options'

import { FilesService } from '../files/files.service'
import { PeopleService } from '../people/people.service'
import { VideoDto, VideoWithInclude, VideosDefaultInclude } from './videos.dto'

@Injectable()
export class VideosService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly pornScraperService: PornScraperService,
    private readonly filesService: FilesService,
    private readonly peopleService: PeopleService,
  ) {}

  static readonly AMOUNT_PER_PAGE = 25

  async toDto(video: VideoWithInclude): Promise<VideoDto> {
    const [coverUrl] = await Promise.all([
      this.filesService.getAssetPreSignedUrl(video.coverUrlKey),
    ])

    return {
      id: video.id,
      code: video.code,
      name: video.name,
      releaseDate: video.releaseDate,
      length: video.length,
      // createdAt: video.createdAt,
      // updatedAt: video.updatedAt,
      coverUrl,
      maker: video.maker?.name || null,
      label: video.label?.name || null,
      tags: video.tags?.map((tag) => tag.name),
      directors:
        video.directors?.map((director) =>
          stringifyAliases(director.aliases),
        ) || [],
      actors:
        video.actors?.map((actor) => stringifyAliases(actor.aliases)) || [],
    }
  }

  async findByCode(
    code: string,
    { forceUpdate = false } = {},
  ): Promise<VideoWithInclude> {
    const video = await this.prisma.video.findUnique({
      include: VideosDefaultInclude,
      where: { code },
    })
    if (!forceUpdate && video) {
      return video
    }

    return this._fetchVideoFromScraper(code)
  }

  async findAll(
    codes?: string[],
    { amount = VideosService.AMOUNT_PER_PAGE, page }: IPaginationOptions = {},
  ): Promise<VideoWithInclude[]> {
    const videos = await this.prisma.video.findMany({
      include: VideosDefaultInclude,
      where: {
        code: codes ? { in: codes } : undefined,
      },
      take: amount,
      skip: (page - 1 || 0) * amount,
      orderBy: { releaseDate: 'desc' },
    })

    if (!codes) {
      return videos
    }

    const existingVideoCodes = videos.map((v) => v.code)
    const newVideos = await Promise.all(
      codes
        .filter((x) => !existingVideoCodes.includes(x))
        .map(this._fetchVideoFromScraper),
    )

    return [...videos, ...newVideos]
  }

  async findByTags(
    tags: string[],
    { amount = VideosService.AMOUNT_PER_PAGE, page }: IPaginationOptions = {},
  ): Promise<VideoWithInclude[]> {
    return this.prisma.video.findMany({
      include: VideosDefaultInclude,
      where: {
        tags: {
          every: {
            name: { in: tags },
          },
        },
      },
      take: amount,
      skip: (page - 1 || 0) * amount,
      orderBy: { releaseDate: 'desc' },
    })
  }

  private async _fetchVideoFromScraper(
    code: string,
  ): Promise<VideoWithInclude> {
    // TODO setup queue for request to limit max simultaneous scrape
    const scraperResult = await this.pornScraperService.getByCode(code)

    const data = scraperResult.data

    const releaseDate = data.release_date
      ? DayJS.utc(data.release_date).toDate()
      : undefined

    const [actors, coverKey] = await Promise.all([
      this.peopleService.find(data.actresses),
      this.filesService.uploadAssetFromUrl(data.image),
    ])

    const params: Prisma.XOR<
      Prisma.VideoCreateInput,
      Prisma.VideoUncheckedCreateInput
    > = {
      code: data.code.trim(),
      name: data.name.trim(),
      releaseDate,
      coverUrlKey: coverKey,
      length: 0,
      label: {
        connectOrCreate: {
          create: { name: 'placeholder' },
          where: { name: 'placeholder' },
        },
      },
      maker: {
        connectOrCreate: {
          create: { name: data.studio.trim() },
          where: { name: data.studio.trim() },
        },
      },
      actors: {
        connect: actors.map((actor) => ({ id: actor.id })),
      },
      tags: {
        connectOrCreate: data.genres.map((tag) => ({
          create: { name: tag.trim() },
          where: { name: tag.trim() },
        })),
      },
    }

    return this.prisma.video.upsert({
      include: VideosDefaultInclude,
      where: { code: data.code.trim() },
      create: params,
      update: params,
    })
  }
}
