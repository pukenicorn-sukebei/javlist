import * as UrlUtils from '@_utils/url'

describe('Url Utils', () => {
  describe('replaceHost', () => {
    describe('should replace host correctly', () => {
      it.each([
        {
          name: 'With protocol / With protocol',
          data: [
            'https://bucket.region.s3.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
            'https://bucket.region.cdn.aws.com',
            'https://bucket.region.cdn.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
          ],
        },
        {
          name: 'With protocol / With prefix',
          data: [
            'https://bucket.region.s3.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
            '//bucket.region.cdn.aws.com',
            'https://bucket.region.cdn.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
          ],
        },
        {
          name: 'With protocol / Bare',
          data: [
            'https://bucket.region.s3.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
            'bucket.region.cdn.aws.com',
            'https://bucket.region.cdn.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
          ],
        },
      ])('$name', ({ data: [input, newHost, expected] }) =>
        expect(UrlUtils.replaceHost(input, newHost)).toEqual(expected),
      )
    })
    describe('should throw TypeError', () => {
      it.each([
        {
          name: 'With prefix / With protocol',
          data: [
            '//bucket.region.s3.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
            'https://bucket.region.cdn.aws.com',
          ],
        },
        {
          name: 'With prefix / With prefix',
          data: [
            '//bucket.region.s3.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
            '//bucket.region.cdn.aws.com',
          ],
        },
        {
          name: 'With prefix / Bare',
          data: [
            '//bucket.region.s3.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
            'bucket.region.cdn.aws.com',
          ],
        },
        {
          name: 'Bare / With protocol',
          data: [
            'bucket.region.s3.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
            'https://bucket.region.cdn.aws.com',
          ],
        },
        {
          name: 'Bare / With prefix',
          data: [
            'bucket.region.s3.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
            '//bucket.region.cdn.aws.com',
          ],
        },
        {
          name: 'Bare / Bare',
          data: [
            'bucket.region.s3.aws.com/base/xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Date=20221013T075000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&x-id=GetObject',
            'bucket.region.cdn.aws.com',
          ],
        },
      ])('$name', ({ data: [input, newHost] }) =>
        expect(() => UrlUtils.replaceHost(input, newHost)).toThrow(
          'Invalid URL',
        ),
      )
    })
  })
})
