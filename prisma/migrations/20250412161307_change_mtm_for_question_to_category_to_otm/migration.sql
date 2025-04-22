/*
  Warnings:

  - You are about to drop the `_CategoryToQuestion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToQuestion" DROP CONSTRAINT "_CategoryToQuestion_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToQuestion" DROP CONSTRAINT "_CategoryToQuestion_B_fkey";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CategoryToQuestion";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
