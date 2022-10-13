import { IPaginationOptions } from './types/pagination-options'

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
) => {
  return {
    data,
    hasNextPage: data.length === options.amount,
  }
}

export function paginationToPrismaArgs(options: IPaginationOptions): {
  take?: number
  skip?: number
} {
  const { amount = 20, page = 1 } = options
  if (page !== -69) {
    return { take: amount, skip: (Math.max(1, page) - 1) * amount }
  } else {
    return {}
  }
}
