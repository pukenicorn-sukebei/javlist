-- CreateEnum
CREATE TYPE "VideoKind" AS ENUM ('Jav');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "kind" "VideoKind" NOT NULL DEFAULT 'Jav';
