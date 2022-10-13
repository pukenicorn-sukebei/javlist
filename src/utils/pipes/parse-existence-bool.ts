import { ArgumentMetadata, PipeTransform } from '@nestjs/common'

export class ParseExistenceBool implements PipeTransform<any, boolean> {
  transform(value: any, metadata: ArgumentMetadata): boolean {
    if (metadata.metatype !== Boolean) {
      return value
    }
    return value !== undefined
  }
}
