import { ParseArrayOptions } from '@nestjs/common/pipes/parse-array.pipe'

export const parseStringArrayOptions: ParseArrayOptions = {
  items: String,
  separator: ',',
}

export const parseOptionalStringArrayOptions: ParseArrayOptions = {
  ...parseStringArrayOptions,
  optional: true,
}
