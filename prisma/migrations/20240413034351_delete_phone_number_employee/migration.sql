/*
  Warnings:

  - You are about to drop the column `phone_number` on the `employee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "employee_phone_number_key";

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "phone_number";
