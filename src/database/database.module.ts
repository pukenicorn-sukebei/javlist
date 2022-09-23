import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Module({
  providers: [
    {
      provide: PrismaClient,
      useClass: PrismaClient,
    },
  ],
  exports: [PrismaClient],
})
export class DatabaseModule {}
