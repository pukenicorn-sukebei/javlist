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
  const maker: VideoMaker = {
    ...mockCommon(),
    name: videoMakerTitle(),
    videos: [],
  }

  maker.videos = opts.videos ?? [mockVideo({ maker })]

  return maker
}

export function mockVideoLabel(opts: Partial<VideoLabel> = {}): VideoLabel {
  const label: VideoLabel = {
    ...mockCommon(),
    name: videoLabelTitle(),
    videos: [],
  }

  label.videos = opts.videos ?? [mockVideo({ label })]

  return label
}

export function mockVideoTag(opts: Partial<VideoTag> = {}): VideoTag {
  const tag: VideoTag = {
    id: Faker.datatype.uuid(),
    name: videoTagTitle(),
    slug: Faker.lorem.slug(3),
    videos: [],
  }

  tag.videos = opts.videos ?? [mockVideo({ tags: [tag] })]

  return tag
}

export function mockPersonAlias(opts: Partial<PersonAlias> = {}): PersonAlias {
  return {
    ...mockCommon(),
    id: Faker.datatype.uuid(),
    alias: personAlias(),
    person: opts.person ?? mockPerson(),
  }
}

export function mockPerson(opts: Partial<Person> = {}): Person {
  const person: Person = {
    ...mockCommon(),
    aliases: opts.aliases ?? [mockPersonAlias()],
    alias: 'mock',
    directed: [],
    starred: [],
  }

  person.directed = opts.directed ?? [mockVideo({ directors: [person] })]
  person.starred = opts.starred ?? [mockVideo({ actors: [person] })]

  return person
}

export function mockVideo(opts: Partial<Video> = {}): Video {
  const video: Video = {
    ...mockCommon(),
    type: Faker.helpers.arrayElement(VideoType[Symbol.iterator]),
    code: Faker.hacker.abbreviation(),
    title: Faker.commerce.productDescription(),
    releaseDate: Faker.date.past(),
    length: Faker.datatype.number(),
    // cover: Faker.image.imageUrl(),
    samples: [],
    maker: undefined,
    label: undefined,
    tags: [],
    directors: [],
    actors: [],
  }

  video.maker = mockVideoMaker({ videos: [video] })
  video.label = opts.label ?? mockVideoLabel({ videos: [video] })
  video.tags = opts.tags ?? [mockVideoTag({ videos: [video] })]
  video.directors = opts.directors ?? [mockPerson({ directed: [video] })]
  video.actors = opts.actors ?? [
    mockPerson({ starred: [video] }),
    mockPerson({ starred: [video] }),
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
    id: Faker.datatype.uuid(),
    originalName: Faker.system.fileName(),
    originalPath: Faker.system.filePath(),
    uploadedPath,
    createdAt: Faker.date.past(),
    updatedAt: Faker.date.soon(),
    uploadedBucket: Faker.word.noun(),
  }
}
