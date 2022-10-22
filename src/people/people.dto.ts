import { Prisma } from '@_generated/prisma'

import { VideosRelationInclude } from '../videos/videos.dto'

export const PeopleDefaultInclude = {
  aliases: true,
  directed: VideosRelationInclude,
  starred: VideosRelationInclude,
}
export type PersonWithInclude<
  IC = {
    include: typeof PeopleDefaultInclude
  },
> = Prisma.PersonGetPayload<IC>

export class PersonDto {
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
