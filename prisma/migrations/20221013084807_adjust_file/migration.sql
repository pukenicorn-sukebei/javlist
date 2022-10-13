/*
  Warnings:

  - Added the required column `uploadedBucket` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "uploadedBucket" TEXT NOT NULL,
ALTER COLUMN "originalName" DROP NOT NULL;
