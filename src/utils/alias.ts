import { PersonAlias } from '@prisma/client'

export function stringifyAliases(aliases: (PersonAlias | string)[]) {
  const _aliases = aliases.map((alias) =>
    typeof alias === 'string' ? alias : alias?.alias,
  )
  switch (_aliases.length) {
    case 0:
      return ''
    case 1:
      return _aliases[0]
    default:
      const [latest, ...rest] = _aliases
      return `${latest} (${rest.join(', ')})`
  }
}
