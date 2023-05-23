import { snakeCase } from 'typeorm/util/StringUtils'

import {
  IPaginationOptions,
  IPaginationQueryOptions,
} from '@_utils/types/pagination-options'

export function paginationOptionsToQueryArgs(
  options: IPaginationOptions,
  defaultSort?: string,
): IPaginationQueryOptions {
  return {
    ...paginationOptionsToQueryPaginationArgs(options),
    ...paginationOptionsToQuerySortByArgs(options, defaultSort),
  }
}

export function paginationOptionsToQueryPaginationArgs(
  options: IPaginationOptions,
): Pick<IPaginationQueryOptions, 'take' | 'skip'> {
  const { amount = 20, page = 1 } = options
  return {
    take: amount,
    skip: (Math.max(1, page) - 1) * amount,
  }
}

export function paginationOptionsToQuerySortByArgs(
  options: IPaginationOptions,
  defaultValue?: string,
): Pick<IPaginationQueryOptions, 'orderBy'> {
  const order = options.order || defaultValue
  if (!order) {
    return {}
  }

  const orderBy = {}
  const orderItems = order.split(',')
  for (let item of orderItems) {
    item = item.trim()
    let value = 'ASC'
    if (item.startsWith('-')) {
      value = 'DESC'
      item = item.substring(1)
    }
    item = snakeCase(item)

    const keys = item.split('.')
    const lastKey = keys.splice(keys.length - 1, 1)[0].trim()
    let ref: any = orderBy
    for (let key of keys) {
      key = key.trim()
      ref[key] ||= {}
      ref = ref[key]
    }
    ref[lastKey] = value
  }

  return { orderBy }
}
