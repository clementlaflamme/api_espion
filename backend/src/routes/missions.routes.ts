import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import prisma from "../../utils/prisma.js";

const routerMissions = Router();

// TODO: Ajouter permissions
routerMissions.get("/", async (req: Request, res: Response) => {
  try {
    const missions = await prisma.mission.findMany();
    res.status(200).json(missions);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des missions." });
  }
});

// Create
routerMissions.post("/creer", async (req: Request, res: Response) => {
  try {
    const { titre, description, nivConfidentialite, statut, recompense } =
      req.body;

    const donneesAInserer: any = { titre, description, recompense };
    if (nivConfidentialite !== undefined)
      donneesAInserer.nivConfidentialite = nivConfidentialite;
    if (statut !== undefined) donneesAInserer.statut = statut;

    const mission = await prisma.mission.create({
      data: donneesAInserer,
    });
    res.status(201).json({ message: "Mission créée :", mission });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Erreur: requête mal formée." });
  }
});

// Patch
routerMissions.patch("/assigner", async (req: Request, res: Response) => {
  try {
    const { id_mission, id_agent } = req.body;
    const mission = await prisma.mission.update({
      where: { id: id_mission },
      data: { agentId: id_agent },
    });
    res.status(20).json({ message: "Agent assigné :", mission });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Erreur: requête mal formée." });
  }
});

// Delete
routerMissions.delete("/supprimer:id", async (req: Request, res: Response) => {
  try {
    const id: any = req.params.id;
    const mission = await prisma.mission.delete({ where: id });
    res.status(20).json({ message: "Mission supprimée :", mission });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Erreur: mission non trouvée." });
  }
});
