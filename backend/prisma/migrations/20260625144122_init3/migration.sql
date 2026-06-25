/*
  Warnings:

  - Made the column `agentId` on table `Mission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_agentId_fkey";

-- AlterTable
ALTER TABLE "Mission" ALTER COLUMN "agentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
