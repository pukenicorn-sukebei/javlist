export function parseTruthyFalsyString(value: string | undefined): boolean {
  switch (value) {
    case undefined:
    case 'undefined':
    case null:
    case 'null':
    case '':
    case '0':
    case 'false':
    case 'NaN':
      return false
    default:
      return true
  }
}
