import { Prisma } from '@_generated/prisma'

import PersonArgs = Prisma.PersonArgs

export const PeopleDefaultInclude = {
  aliases: true,
  directed: true,
  starred: true,
}
export type PersonWithInclude<
  IC extends boolean | PersonArgs | null | undefined = {
    include: typeof PeopleDefaultInclude
  },
> = Prisma.PersonGetPayload<IC>
export type PersonWithAliases<
  IC extends boolean | PersonArgs | null | undefined = {
    include: { aliases: true }
  },
> = Prisma.PersonGetPayload<IC>
