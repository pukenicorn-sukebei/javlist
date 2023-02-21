import { VideoKind } from '@_generated/prisma'

const extractorRegexes = {
  [VideoKind.Jav]: /([A-Za-z]{2,6}|t-?28)[ \-_]?(\d+)([ez])?/i
}

const badWordRegex = /hhd800|@|\.com|\.(?:avi|mp4)$/i

export function normalizeCode(code: string): string | null {
  code = code.replace(badWordRegex, '')

  const regexMatch = extractorRegexes.Jav.exec(code)
  if (!regexMatch) return null

  // for jav only for now
  const prefix = regexMatch[1].toUpperCase().replace('-', '')
  const id = String(+regexMatch[2]).padStart(3, '0')
  const suffix = regexMatch[3] || ''
  code = `${prefix}-${id}${suffix}`

  return code
}
