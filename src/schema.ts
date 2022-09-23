import { makeSchema, objectType, queryType, stringArg } from 'nexus'
import { Video, VideoTag } from 'nexus-prisma'
import NexusPrismaScalars from 'nexus-prisma/scalars'

// TODO WIP
export const schema = makeSchema({
  types: [
    NexusPrismaScalars,
    objectType({
      name: Video.$name,
      description: Video.$description,
      definition(t) {
        t.field(Video.id)
        t.field(Video.code)
        t.field(Video.name)
        t.field(Video.releaseDate)
        t.field(Video.length)
        // t.field(Video.label)
        // t.field(Video.maker)
        // t.field(Video.directors)
        // t.field(Video.actors)
        t.field(Video.tags)
        t.field(Video.createdAt)
        t.field(Video.updatedAt)
      },
    }),
    objectType({
      name: VideoTag.$name,
      description: VideoTag.$description,
      definition(t) {
        t.field(VideoTag.id)
        t.field(VideoTag.name)
        // t.field(VideoTag.videos)
      },
    }),
    queryType({
      definition(t) {
        t.nonNull.list.nonNull.field(VideoTag.videos.name, {
          type: Video.$name,
          args: {
            code: stringArg(),
          },
          resolve(a, b, ctx) {
            console.log(a, b)
            return []
          },
        })
        t.nonNull.list.nonNull.field(Video.tags.name, {
          type: VideoTag.$name,
          resolve(_, __, ctx) {
            return ctx.prisma.videoTags.findMany()
          },
        })
      },
    }),
  ],
})
