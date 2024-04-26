/*
  Warnings:

  - A unique constraint covering the columns `[device_token]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "device_token" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "employee_device_token_key" ON "employee"("device_token");
