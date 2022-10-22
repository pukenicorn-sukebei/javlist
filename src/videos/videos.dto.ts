import { Prisma } from '@_generated/prisma'

import SortOrder = Prisma.SortOrder

export const VideosDefaultInclude = {
  label: true,
  maker: true,
  directors: {
    include: { aliases: true },
  },
  actors: {
    include: { aliases: true },
  },
  tags: true,
}
export const VideosRelationInclude = {
  orderBy: [{ releaseDate: SortOrder.desc }],
}

export type VideoWithInclude<
  IC = {
    include: typeof VideosDefaultInclude
  },
> = Prisma.VideoGetPayload<IC>

export class VideoDto {
  id: string
  code: string
  name?: string
  releaseDate?: Date
  length: number
  // createdAt: Date
  // updatedAt: Date
  coverUrl: string
  maker: string
  label: string
  tags: string[]
  directors: string[]
  actors: string[]
}
