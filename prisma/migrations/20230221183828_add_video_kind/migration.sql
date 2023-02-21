/*
  Warnings:

  - Added the required column `kind` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VideoKind" AS ENUM ('Jav');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "kind" "VideoKind" NOT NULL;
