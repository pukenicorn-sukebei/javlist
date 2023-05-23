import { faker as Faker } from '@faker-js/faker'
import * as Path from 'path'

import {
  Asset,
  Person,
  PersonAlias,
  Video,
  VideoLabel,
  VideoMaker,
  VideoTag,
  VideoType,
} from '@_models'

import { VideoDto } from '../../videos/videos.dto'

function mockId() {
  return { slug: Faker.lorem.slug(3) }
}

function mockSlug() {
  return { id: Faker.datatype.uuid() }
}

function mockTimestamp() {
  return {
    createdAt: Faker.date.past(),
    updatedAt: Faker.date.soon(),
  }
}

function mockCommon() {
  return {
    ...mockId(),
    ...mockSlug(),
    ...mockTimestamp(),
  }
}

function stubForSlug() {
  return {
    fieldToSlug: ':(',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    slugify: function () {},
  }
}

////////////////////////////////////////////////////////////////////////////////

function videoMakerTitle(): string {
  return Faker.company.name()
}

function videoLabelTitle(): string {
  return Faker.company.catchPhrase()
}

function videoTagTitle(): string {
  return Faker.commerce.productAdjective()
}

function personAlias(): string {
  return Faker.name.fullName()
}

////////////////////////////////////////////////////////////////////////////////

export function mockVideoMaker(opts: Partial<VideoMaker> = {}): VideoMaker {
  const _maker: Partial<VideoMaker> = {
    ...stubForSlug(),
    ...mockCommon(),
    name: opts.name ?? videoMakerTitle(),
    slug: opts.slug ?? Faker.lorem.slug(3),
    videos: [],
  }
  const maker = _maker as VideoMaker

  maker.videos = opts.videos ?? [mockVideo({ maker })]

  return maker as VideoMaker
}

export function mockVideoLabel(opts: Partial<VideoLabel> = {}): VideoLabel {
  const _label: Partial<VideoLabel> = {
    ...mockCommon(),
    name: opts.name ?? videoLabelTitle(),
    slug: opts.slug ?? Faker.lorem.slug(3),
    videos: [],
  }
  const label = _label as VideoLabel

  label.videos = opts.videos ?? [mockVideo({ label })]

  return label
}

export function mockVideoTag(opts: Partial<VideoTag> = {}): VideoTag {
  const _tag: Partial<VideoTag> = {
    name: opts.name ?? videoTagTitle(),
    slug: opts.slug ?? Faker.lorem.slug(3),
    videos: [],
  }

  const tag = _tag as VideoTag

  tag.videos = opts.videos ?? [mockVideo({ tags: [tag] })]

  return tag
}

export function mockPersonAlias(opts: Partial<PersonAlias> = {}): PersonAlias {
  const _alias: Partial<PersonAlias> = {
    ...mockCommon(),
    id: opts.id ?? Faker.datatype.uuid(),
    alias: opts.alias ?? personAlias(),
    person: {} as any,
  }

  const alias = _alias as PersonAlias

  alias.person = opts.person ?? mockPerson({ aliases: [alias] })

  return alias
}

export function mockPerson(opts: Partial<Person> = {}): Person {
  const _person: Partial<Person> = {
    ...mockCommon(),
    alias: opts.alias ?? 'mock',
    aliases: [],
    directed: [],
    starred: [],
  }

  const person = _person as Person

  person.aliases = opts.aliases ?? [mockPersonAlias({ person })]
  person.directed = opts.directed ?? [
    mockVideo({ actors: [person], directors: [person] }),
  ]
  person.starred = opts.starred ?? [
    mockVideo({ actors: [person], directors: [person] }),
  ]

  return person
}

export function mockVideo(opts: Partial<Video> = {}): Video {
  const _video: Partial<Video> = {
    ...mockCommon(),
    type: opts.type ?? Faker.helpers.arrayElement(VideoType[Symbol.iterator]),
    code: opts.code ?? Faker.hacker.abbreviation(),
    title: opts.title ?? Faker.commerce.productDescription(),
    releaseDate: opts.releaseDate ?? Faker.date.past(),
    length: opts.length ?? Faker.datatype.number(),
    // cover: Faker.image.imageUrl(),
    samples: [],
    maker: {} as any,
    label: {} as any,
    tags: [],
    directors: [],
    actors: [],
  }

  const video = _video as Video

  video.maker = mockVideoMaker({ videos: [video] })
  video.label = opts.label ?? mockVideoLabel({ videos: [video] })
  video.tags = opts.tags ?? [mockVideoTag({ videos: [video] })]
  video.directors = opts.directors ?? [
    mockPerson({ directed: [video], starred: [video] }),
  ]
  video.actors = opts.actors ?? [
    mockPerson({ directed: [video], starred: [video] }),
    mockPerson({ directed: [video], starred: [video] }),
  ]

  return video
}

export function mockVideoDto(): VideoDto {
  return {
    id: Faker.datatype.uuid(),
    code: Faker.hacker.abbreviation(),
    name: Faker.commerce.productDescription(),
    releaseDate: Faker.date.past(),
    length: Faker.datatype.number(),
    coverUrl: Faker.image.imageUrl(),
    sampleUrls: [Faker.image.imageUrl()],
    maker: videoMakerTitle(),
    label: videoLabelTitle(),
    tags: [videoTagTitle()],
    directors: [personAlias()],
    actors: [personAlias(), personAlias()],
  }
}

export function mockFile({
  uploadedPathPrefix,
}: { uploadedPathPrefix?: string } = {}): Asset {
  let uploadedPath = Faker.datatype.uuid() + '.jpg'
  if (uploadedPath) {
    uploadedPath = Path.posix.join(uploadedPathPrefix!, uploadedPath)
  }
  return {
    type: '', // TODO impl
    id: Faker.datatype.uuid(),
    originalName: Faker.system.fileName(),
    originalPath: Faker.system.filePath(),
    uploadedPath,
    createdAt: Faker.date.past(),
    updatedAt: Faker.date.soon(),
    uploadedBucket: Faker.word.noun(),
  }
}
