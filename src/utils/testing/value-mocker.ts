import { faker as Faker } from '@faker-js/faker'
import * as Path from 'path'

import {
  File,
  FileType,
  PersonAlias,
  VideoLabel,
  VideoMaker,
  VideoTag,
} from '@_generated/prisma'

import { PersonWithAliases } from '../../people/people.dto'
import { VideoDto, VideoWithInclude } from '../../videos/videos.dto'

export function mockVideoMakerName(): string {
  return Faker.company.name()
}

export function mockVideoMaker(): VideoMaker {
  return {
    id: Faker.datatype.uuid(),
    name: mockVideoMakerName(),
    createdAt: Faker.date.past(),
    updatedAt: Faker.date.soon(),
  }
}

export function mockVideoLabelName(): string {
  return Faker.company.catchPhrase()
}

export function mockVideoLabel(): VideoLabel {
  return {
    id: Faker.datatype.uuid(),
    name: mockVideoLabelName(),
    createdAt: Faker.date.past(),
    updatedAt: Faker.date.soon(),
  }
}

export function mockVideoTagName(): string {
  return Faker.commerce.productAdjective()
}

export function mockVideoTag(): VideoTag {
  return {
    id: Faker.datatype.uuid(),
    name: mockVideoTagName(),
  }
}

export function mockPersonAliasAlias(): string {
  return Faker.name.fullName()
}

export function mockPersonAlias(): PersonAlias {
  return {
    id: Faker.datatype.uuid(),
    personId: Faker.datatype.uuid(),
    alias: mockPersonAliasAlias(),
  }
}

export function mockPersonWithAliases(): PersonWithAliases {
  return {
    id: Faker.datatype.uuid(),
    aliases: [mockPersonAlias()],
    createdAt: Faker.date.past(),
    updatedAt: Faker.date.soon(),
  }
}

export function mockVideoWithInclude(): VideoWithInclude {
  return {
    id: Faker.datatype.uuid(),
    code: Faker.hacker.abbreviation(),
    name: Faker.commerce.productDescription(),
    releaseDate: Faker.date.past(),
    length: Faker.datatype.number(),
    coverPath: Faker.image.imageUrl(),
    maker: mockVideoMaker(),
    makerId: Faker.datatype.uuid(),
    label: mockVideoLabel(),
    labelId: Faker.datatype.uuid(),
    tags: [mockVideoTag()],
    directors: [mockPersonWithAliases()],
    actors: [mockPersonWithAliases(), mockPersonWithAliases()],
    createdAt: Faker.date.past(),
    updatedAt: Faker.date.soon(),
  }
}

export function mockVideoDto(): VideoDto {
  return {
    id: Faker.datatype.uuid(),
    code: Faker.hacker.abbreviation(),
    name: Faker.commerce.productDescription(),
    releaseDate: Faker.date.past(),
    length: Faker.datatype.number(),
    coverUrl: Faker.image.imageUrl(),
    maker: mockVideoMakerName(),
    label: mockVideoLabelName(),
    tags: [mockVideoTagName()],
    directors: [mockPersonAliasAlias()],
    actors: [mockPersonAliasAlias(), mockPersonAliasAlias()],
  }
}

export function mockFile({
  uploadedPathPrefix,
}: { uploadedPathPrefix?: string } = {}): File {
  let uploadedPath = Faker.datatype.uuid() + '.jpg'
  if (uploadedPath) {
    uploadedPath = Path.posix.join(uploadedPathPrefix!, uploadedPath)
  }
  return {
    id: Faker.datatype.uuid(),
    type: Faker.helpers.arrayElement(Object.values(FileType)),
    originalName: Faker.system.fileName(),
    originalPath: Faker.system.filePath(),
    uploadedPath,
    createdAt: Faker.date.past(),
    updatedAt: Faker.date.soon(),
    uploadedBucket: Faker.word.noun(),
  }
}
