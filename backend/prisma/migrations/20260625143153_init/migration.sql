-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AGENT', 'CHEF');

-- CreateEnum
CREATE TYPE "Habilitation" AS ENUM ('CONFIDENTIEL', 'SECRET', 'TRES_SECRET');

-- CreateEnum
CREATE TYPE "StatutMission" AS ENUM ('DISPONIBLE', 'EN_COURS', 'REUSSIE', 'ECHOUEE');

-- CreateTable
CREATE TABLE "Agent" (
    "id" SERIAL NOT NULL,
    "mdp" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AGENT',
    "habilitation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "nivConfidentialite" "Habilitation" NOT NULL DEFAULT 'CONFIDENTIEL',
    "statut" "StatutMission" NOT NULL DEFAULT 'DISPONIBLE',
    "recompense" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" INTEGER,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
