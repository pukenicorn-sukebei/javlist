export class VideoDto {
  id: string
  code: string
  name?: string | null
  releaseDate?: Date | null
  length: number | null
  // createdAt: Date
  // updatedAt: Date
  coverUrl: string | null
  sampleUrls: string[]
  maker: string | null
  label: string | null
  tags: string[]
  directors: string[]
  actors: string[]
}
