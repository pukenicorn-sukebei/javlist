import { IPaginationOptions } from '@_utils/types/pagination-options'

export function paginationOptionsToPrismaPaginationArgs(
  options: IPaginationOptions,
): {
  take?: number
  skip?: number
} {
  const { amount = 20, page = 1 } = options
  return {
    take: amount,
    skip: (Math.max(1, page) - 1) * amount,
  }
}

export function paginationOptionsToPrismaSortByArgs(
  options: IPaginationOptions,
  defaultValue?: string,
): { orderBy?: any } {
  const order = options.order || defaultValue
  if (!order || order === '') {
    return {}
  }

  const orderBy = {}
  const orderItems = order.split(',')
  for (let item of orderItems) {
    item = item.trim()
    let value = 'asc'
    if (item.startsWith('-')) {
      value = 'desc'
      item = item.substring(1)
    }

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
