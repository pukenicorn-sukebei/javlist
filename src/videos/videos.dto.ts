import { Prisma } from '@_generated/prisma'

import VideoArgs = Prisma.VideoArgs

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
export type VideoWithInclude<
  IC extends boolean | VideoArgs | null | undefined = {
    include: typeof VideosDefaultInclude
  },
> = Prisma.VideoGetPayload<IC>

export class VideoDto {
  id: string
  code: string
  name?: string | null
  releaseDate?: Date | null
  length: number
  // createdAt: Date
  // updatedAt: Date
  coverUrl: string
  maker?: string | null
  label?: string | null
  tags: string[]
  directors: string[]
  actors: string[]
}
