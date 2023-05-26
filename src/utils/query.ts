import { FindOptionsWhere, In } from 'typeorm'

import { slugify } from '@_utils/slug'

import { WithSlug } from '../models/base.entity'

export function queryToSlugQuery(
  query: string | string[],
): FindOptionsWhere<WithSlug> {
  return {
    slug: Array.isArray(query)
      ? In(query.map((x) => slugify(x)))
      : slugify(query),
  }
}
