export function parseTruthyFalsyString(value: string | undefined): boolean {
  switch (value) {
    case undefined:
    case 'undefined':
    case null:
    case 'null':
    case '0':
    case '-0':
    case 'false':
    case 'NaN':
      return false
    case '':
    default:
      return true
  }
}

export function parseBool(value: string | undefined): boolean {
  switch (value) {
    case '':
    case undefined:
    case 'undefined':
    case null:
    case 'null':
    case '0':
    case '-0':
    case 'false':
    case 'NaN':
      return false
    default:
      return true
  }
}
