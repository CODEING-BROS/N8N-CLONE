/*
  Warnings:

  - You are about to drop the column `createdAt` on the `workflow` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `workflow` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `workflow` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "workflow" DROP CONSTRAINT "workflow_userId_fkey";

-- AlterTable
ALTER TABLE "workflow" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId";
