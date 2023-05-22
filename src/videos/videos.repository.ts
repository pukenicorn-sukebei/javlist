import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { Video, VideoLabel, VideoMaker, VideoTag } from '@_models'
import { slugify } from '@_utils/slug'
import { IPaginationQueryOptions } from '@_utils/types/pagination-options'

export type QueryOptions = {
  codes?: string | string[]
  tags?: string | string[]
  makers?: string | string[]
  labels?: string | string[]
}

@Injectable()
export class VideosRepository {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(VideoTag)
    private readonly videoTagRepository: Repository<VideoTag>,
    @InjectRepository(VideoMaker)
    private readonly videoMakerRepository: Repository<VideoMaker>,
    @InjectRepository(VideoLabel)
    private readonly videoLabelRepository: Repository<VideoLabel>,
  ) {}

  findByCode(code: string): Promise<Video | null>
  findByCode(
    code: string,
    opts: { loadRelation?: boolean; initOnNotFound: true },
  ): Promise<Video>
  findByCode(
    code: string,
    opts?: { loadRelation?: boolean; initOnNotFound?: boolean },
  ): Promise<Video | null>
  async findByCode(
    code: string,
    opts: { loadRelation?: boolean; initOnNotFound?: boolean } = {},
  ): Promise<Video | null> {
    const { loadRelation = true, initOnNotFound = false } = opts

    const video = await this.videoRepository.findOne({
      where: { code },
      loadEagerRelations: loadRelation,
    })

    if (!video && initOnNotFound) {
      return this.videoRepository.create({ code })
    }

    return video
  }

  async findBy(
    query: QueryOptions = {},
    paginate: IPaginationQueryOptions,
    populate = true,
  ) {
    return this.videoRepository.find({
      where: {
        code:
          query.codes &&
          (Array.isArray(query.codes)
            ? In(query.codes.map((x) => x.toUpperCase()))
            : query.codes.toUpperCase()),
        tags: query.tags
          ? {
              slug: Array.isArray(query.tags)
                ? In(query.tags.map((x) => slugify(x)))
                : slugify(query.tags),
            }
          : undefined,
        maker: query.makers
          ? {
              slug: Array.isArray(query.makers)
                ? In(query.makers.map((x) => slugify(x)))
                : slugify(query.makers),
            }
          : undefined,
        label: query.labels
          ? {
              slug: Array.isArray(query.labels)
                ? In(query.labels.map((x) => slugify(x)))
                : slugify(query.labels),
            }
          : undefined,
      },

      loadEagerRelations: populate,
    })
  }

  save(videos: Video): Promise<Video>
  save(videos: Video[]): Promise<Video[]>
  async save(videos: Video | Video[]) {
    if (Array.isArray(videos)) {
      return this.videoRepository.save(videos)
    } else {
      return this.videoRepository.save(videos)
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  async createTagByName(name: string) {
    const tag = this.videoTagRepository.create({ name })

    return this.videoTagRepository.save(tag)
  }

  async createTagsByName(names: string[]) {
    const tags = this.videoTagRepository.create(names.map((name) => ({ name })))

    return this.videoTagRepository.save(tags)
  }

  findTag(name: string): Promise<VideoTag | null>
  findTag(name: string, opts: { createOnNotFound: true }): Promise<VideoTag>
  findTag(
    name: string,
    opts?: { createOnNotFound?: boolean },
  ): Promise<VideoTag | null>
  async findTag(
    name: string,
    opts: { createOnNotFound?: boolean } = {},
  ): Promise<VideoTag | null> {
    const tag = await this.videoTagRepository.findOneBy({
      slug: slugify(name),
    })

    if (!tag && opts.createOnNotFound) {
      return this.createTagByName(name)
    }

    return tag
  }

  async findManyTags(
    names: string[],
    opts: { createOnNotFound?: boolean } = {},
  ): Promise<VideoTag[]> {
    const tags = await this.videoTagRepository.findBy({
      slug: In(names.map((name) => slugify(name))),
    })

    if (!opts.createOnNotFound) {
      return tags
    }

    const existingTagSlugs = tags.map((tag) => tag.slug)

    const newTags = await this.createTagsByName(
      names.filter((name) => !existingTagSlugs.includes(slugify(name))),
    )

    await this.videoTagRepository.save(newTags)

    return [...tags, ...newTags]
  }

  //////////////////////////////////////////////////////////////////////////////

  async createMakerByName(name: string) {
    const maker = this.videoMakerRepository.create({ name })

    return this.videoMakerRepository.save(maker)
  }

  async createMakersByName(names: string[]) {
    const makers = this.videoMakerRepository.create(
      names.map((name) => ({ name })),
    )

    return this.videoMakerRepository.save(makers)
  }

  findMaker(name: string): Promise<VideoMaker | null>
  findMaker(name: string, opts: { createOnNotFound: true }): Promise<VideoMaker>
  findMaker(
    name: string,
    opts?: { createOnNotFound?: boolean },
  ): Promise<VideoMaker | null>
  async findMaker(
    name: string,
    opts: { createOnNotFound?: boolean } = {},
  ): Promise<VideoMaker | null> {
    const maker = await this.videoMakerRepository.findOneBy({
      slug: slugify(name),
    })

    if (!maker && opts.createOnNotFound) {
      return this.createMakerByName(name)
    }

    return maker
  }

  async findManyMakers(
    names: string[],
    opts: { createOnNotFound?: boolean } = {},
  ): Promise<VideoMaker[]> {
    const makers = await this.videoMakerRepository.findBy({
      slug: In(names.map((name) => slugify(name))),
    })

    if (!opts.createOnNotFound) {
      return makers
    }

    const existingMakerSlugs = makers.map((maker) => maker.slug)

    const newMakers = await this.createMakersByName(
      names.filter((name) => !existingMakerSlugs.includes(slugify(name))),
    )

    await this.videoMakerRepository.save(newMakers)

    return [...makers, ...newMakers]
  }

  //////////////////////////////////////////////////////////////////////////////

  async createLabelByName(name: string) {
    const label = this.videoLabelRepository.create({ name })

    return this.videoLabelRepository.save(label)
  }

  async createLabelsByName(names: string[]) {
    const labels = this.videoLabelRepository.create(
      names.map((name) => ({ name })),
    )

    return this.videoLabelRepository.save(labels)
  }

  findLabel(name: string): Promise<VideoLabel | null>
  findLabel(name: string, opts: { createOnNotFound: true }): Promise<VideoLabel>
  findLabel(
    name: string,
    opts?: { createOnNotFound?: boolean },
  ): Promise<VideoLabel | null>

  async findLabel(
    name: string,
    opts: { createOnNotFound?: boolean } = {},
  ): Promise<VideoLabel | null> {
    const label = await this.videoLabelRepository.findOneBy({
      slug: slugify(name),
    })

    if (!label && opts.createOnNotFound) {
      return this.createLabelByName(name)
    }

    return label
  }

  async findManyLabels(
    names: string[],
    opts: { createOnNotFound?: boolean } = {},
  ): Promise<VideoLabel[]> {
    const labels = await this.videoLabelRepository.findBy({
      slug: In(names.map((name) => slugify(name))),
    })

    if (!opts.createOnNotFound) {
      return labels
    }

    const existingLabelSlugs = labels.map((label) => label.slug)

    const newLabels = await this.createLabelsByName(
      names.filter((name) => !existingLabelSlugs.includes(slugify(name))),
    )

    await this.videoLabelRepository.save(newLabels)

    return [...labels, ...newLabels]
  }
}
