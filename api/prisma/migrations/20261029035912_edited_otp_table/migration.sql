/*
  Warnings:

  - You are about to drop the column `rememberToken` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `verifyToken` on the `Otp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "rememberToken",
DROP COLUMN "verifyToken";
