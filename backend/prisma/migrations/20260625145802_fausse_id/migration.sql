/*
  Warnings:

  - Added the required column `nationalite` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "nationalite" TEXT NOT NULL,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL;
