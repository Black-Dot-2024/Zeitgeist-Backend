/*
  Warnings:

  - You are about to drop the column `id_file` on the `expense` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `expense_report` table. All the data in the column will be lost.
  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `expense_report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "expense" DROP CONSTRAINT "expense_id_file_fkey";

-- AlterTable
ALTER TABLE "expense" DROP COLUMN "id_file",
ADD COLUMN     "url_file" VARCHAR(512);

-- AlterTable
ALTER TABLE "expense_report" DROP COLUMN "total_amount",
ADD COLUMN     "title" VARCHAR(70) NOT NULL;

-- DropTable
DROP TABLE "file";