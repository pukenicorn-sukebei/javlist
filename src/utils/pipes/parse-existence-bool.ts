import { ArgumentMetadata, PipeTransform } from '@nestjs/common'

import { parseTruthyFalsyString } from '@_utils/parsers'

export class ParseExistenceBool implements PipeTransform<any, boolean> {
  transform(value: any, metadata: ArgumentMetadata): boolean {
    if (metadata.metatype !== Boolean) {
      throw new Error(
        `Pipe used with incorrect type; Needed [Boolean], Got ${metadata.metatype}`,
      )
    }

    return parseTruthyFalsyString(value)
  }
}
