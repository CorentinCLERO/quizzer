/*
  Warnings:

  - Added the required column `type` to the `UserAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAnswer" ADD COLUMN     "type" "QuestionType" NOT NULL;
