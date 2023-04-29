import { paginationOptionsToPrismaSortByArgs } from '@_utils/pagination-options'

describe('Pagination Utils', () => {
  describe('paginationOptionsToPrismaPaginationArgs', () => {
    describe('should return correct mapping', () => {
      it.each([
        { input: undefined, expected: undefined },
        { input: '', expected: undefined },
        {
          input: '-field',
          expected: { field: 'desc' },
        },
        {
          input: '-field.another_field',
          expected: { field: { another_field: 'desc' } },
        },
        {
          input: '-field.another_field,some_field',
          expected: { field: { another_field: 'desc' }, some_field: 'asc' },
        },
        {
          input: ' -field.another_field, some_field ',
          expected: { field: { another_field: 'desc' }, some_field: 'asc' },
        },
      ])('item', ({ input, expected }) => {
        const actual = paginationOptionsToPrismaSortByArgs({ order: input })
        expect(actual.orderBy).toEqual(expected)
      })
    })
  })
})
