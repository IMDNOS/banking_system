/*
  Warnings:

  - You are about to drop the column `initiatedById` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_initiatedById_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "initiatedById";
