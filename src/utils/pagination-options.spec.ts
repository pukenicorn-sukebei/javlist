import { paginationOptionsToQuerySortByArgs } from '@_utils/pagination-options'

describe('Pagination Utils', () => {
  describe('paginationOptionsToQueryPaginationArgs', () => {
    describe('should return correct mapping', () => {
      it.each([
        { input: undefined, expected: undefined },
        { input: '', expected: undefined },
        {
          input: '-field',
          expected: { field: 'DESC' },
        },
        {
          input: '-field.camelCase',
          expected: { field: { camel_case: 'DESC' } },
        },
        {
          input: '-field.another_field,PascalCase',
          expected: { field: { another_field: 'DESC' }, pascal_case: 'ASC' },
        },
        {
          input: ' -field.another_field, some_field ',
          expected: { field: { another_field: 'DESC' }, some_field: 'ASC' },
        },
      ])('item', ({ input, expected }) => {
        const actual = paginationOptionsToQuerySortByArgs({ order: input })
        expect(actual.orderBy).toEqual(expected)
      })
    })
  })
})
