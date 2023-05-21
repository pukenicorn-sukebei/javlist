import * as SlugUtils from '@_utils/slug'

describe('Slug Utils', () => {
  describe('slugify', () => {
    describe('should work correctly', () => {
      it.each([
        { input: '------', output: '' },
        { input: 'ASD ASD ASD', output: 'asd-asd-asd' },
        { input: '      ASD----ASD ASD', output: 'asd-asd-asd' },
      ])('$input -> $output', ({ input, output }) =>
        expect(SlugUtils.slugify(input)).toEqual(output),
      )
    })
  })
})
