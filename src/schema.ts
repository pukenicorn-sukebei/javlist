import { makeSchema } from 'nexus'
import NexusPrismaScalars from 'nexus-prisma/scalars'
import * as Path from 'path'

export const schema = makeSchema({
  outputs: {
    typegen: Path.join(process.cwd(), 'generated', 'nexus-typegen.ts'),
    schema: Path.join(process.cwd(), 'generated', 'schema.graphql'),
  },
  types: [
    NexusPrismaScalars,
    // objectType({
    //   name: Video.$name,
    //   description: Video.$description,
    //   definition(t) {
    //     t.field(Video.id)
    //     t.field(Video.code)
    //     t.field(Video.name)
    //     t.field(Video.releaseDate)
    //     t.field(Video.length)
    //     t.string('cover', {
    //       resolve(video: VideoWithInclude, _, ctx: GraphqlContext) {
    //         return ctx.filesService.getAssetPreSignedUrl(video.coverPath)
    //       },
    //     })
    //     t.field(Video.label)
    //     t.field(Video.maker)
    //     t.field(Video.directors)
    //     t.field(Video.actors)
    //     t.field(Video.tags)
    //     t.field(Video.createdAt)
    //     t.field(Video.updatedAt)
    //   },
    // }),
    // objectType({
    //   name: Person.$name,
    //   description: Person.$description,
    //   definition(t) {
    //     t.field(Person.id)
    //     t.field(Person.aliases)
    //     t.field(Person.starred)
    //   },
    // }),
    // objectType({
    //   name: PersonAlias.$name,
    //   description: PersonAlias.$description,
    //   definition(t) {
    //     t.field(PersonAlias.alias)
    //   },
    // }),
    // objectType({
    //   name: VideoTag.$name,
    //   description: VideoTag.$description,
    //   definition(t) {
    //     t.field(VideoTag.id)
    //     t.field(VideoTag.name)
    //     t.field(VideoTag.videos)
    //   },
    // }),
    // objectType({
    //   name: VideoLabel.$name,
    //   description: VideoLabel.$description,
    //   definition(t) {
    //     t.field(VideoLabel.id)
    //     t.field(VideoLabel.name)
    //     t.field(VideoLabel.videos)
    //   },
    // }),
    // objectType({
    //   name: VideoMaker.$name,
    //   description: VideoMaker.$description,
    //   definition(t) {
    //     t.field(VideoMaker.id)
    //     t.field(VideoMaker.name)
    //     t.field(VideoMaker.videos)
    //   },
    // }),
    // queryType({
    //   definition(t) {
    //     t.nonNull.field('video', {
    //       type: Video.$name,
    //       args: {
    //         code: nonNull(stringArg()),
    //       },
    //       resolve(_, args, ctx: GraphqlContext) {
    //         return ctx.videoService.findByCode(args.code)
    //       },
    //     })
    //     t.nonNull.list.nonNull.field('videos', {
    //       type: Video.$name,
    //       args: {
    //         codes: list(nonNull(stringArg())),
    //         page: intArg({ default: 1 }),
    //         numberPerPage: intArg({ default: 25 }),
    //       },
    //       resolve(_, args, ctx: GraphqlContext) {
    //         return ctx.videoService.findAll(args.codes)
    //       },
    //     })
    //     t.nonNull.list.nonNull.field('videosByTags', {
    //       type: Video.$name,
    //       args: {
    //         tags: nonNull(list(nonNull(stringArg()))),
    //       },
    //       resolve(_, args, ctx: GraphqlContext) {
    //         return ctx.videoService.findByTags(args.tags)
    //       },
    //     })
    //   },
    // }),
  ],
})
