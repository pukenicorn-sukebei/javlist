import * as NormalizerUtils from '@_utils/normalizer'

describe('Normalizer Utils', () => {
  describe('normalizeCode', () => {
    describe('should work correctly', () => {
      it.each([
        { input: 'jibberish', output: null },
        { input: 't-28602', output: 'T28-602' },
        { input: 't28-602', output: 'T28-602' },
        { input: 'STARS087', output: 'STARS-087' },
        { input: 'STARS00087', output: 'STARS-087' },
        { input: 'STARS-087', output: 'STARS-087' },
        { input: 'KAVR087', output: 'KAVR-087' },
        { input: 'KAVR00087', output: 'KAVR-087' },
        { input: 'KAVR-087', output: 'KAVR-087' },
        { input: 'TDMN009', output: 'TDMN-009' },
        { input: 'TDMN00009', output: 'TDMN-009' },
        { input: 'TDMN-009', output: 'TDMN-009' },
        { input: 'SSIS513', output: 'SSIS-513' },
        { input: 'SSIS00513', output: 'SSIS-513' },
        { input: 'SSIS-513', output: 'SSIS-513' },
        { input: 'DVDMS868', output: 'DVDMS-868' },
        { input: 'DVDMS00868', output: 'DVDMS-868' },
        { input: 'DVDMS-868', output: 'DVDMS-868' },
        { input: 'URVRSP175', output: 'URVRSP-175' },
        { input: 'URVRSP00175', output: 'URVRSP-175' },
        { input: 'URVRSP-175', output: 'URVRSP-175' },
        { input: 'MBDD-2076', output: 'MBDD-2076' },
        { input: 'MBDD-2076', output: 'MBDD-2076' },
        { input: 'MBDD-2076', output: 'MBDD-2076' },
        { input: 'KTRA425e', output: 'KTRA-425e' },
        { input: 'KTRA00425e', output: 'KTRA-425e' },
        { input: 'KTRA-425e', output: 'KTRA-425e' },
        { input: 'IBW873z', output: 'IBW-873z' },
        { input: 'IBW00873z', output: 'IBW-873z' },
        { input: 'IBW-873z', output: 'IBW-873z' },
        { input: 'hhd800.com@MIDV-041.mp4', output: 'MIDV-041' },
        { input: 'hhd800_com_MIDV-041_mp4', output: 'MIDV-041' },
      ])('$input -> $output', ({ input, output }) =>
        expect(NormalizerUtils.normalizeCode(input)).toEqual(output),
      )
    })
  })
})
