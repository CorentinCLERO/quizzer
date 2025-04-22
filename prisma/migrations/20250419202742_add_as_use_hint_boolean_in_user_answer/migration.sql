/*
  Warnings:

  - Added the required column `asUseHint` to the `UserAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAnswer" ADD COLUMN     "asUseHint" BOOLEAN NOT NULL;
