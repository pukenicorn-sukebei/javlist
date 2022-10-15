import { Module } from '@nestjs/common'

import { PrismaClient } from '@_clients/prisma'

@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        const prisma = new PrismaClient()

        // prisma.$use()

        return prisma
      },
    },
  ],
  exports: [PrismaClient],
})
export class DatabaseModule {}
