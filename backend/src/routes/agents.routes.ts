import { Router, type Request, type Response } from "express"
import axios from "axios"
import bcrypt from "bcryptjs"
import prisma from "../../utils/prisma.js"
import { authentifier, exigerRole } from "../middleware/auth.js"

const routerAgents = Router()


async function recupererIdentite() {
    try {
        const { data } = await axios.get("https://randomuser.me/api/")
        const r = data.results[0]

        return {
            nom: `${r.name.first} ${r.name.last}`,
            nationalite: r.nat,
            photo: r.picture.large,
            email: r.email
        }
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            console.log("Statut HTTP :", e.response.status)
        } else {
            console.log("Erreur de réseau ou timeout")
        }
        return null
    }
}


routerAgents.post("/recruter", async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ erreur: "Champs manquants" })
    }

    const identite = await recupererIdentite()
    if (!identite) {
        return res.status(500).json({ erreur: "Impossible de générer une identité" })
    }

    try {
        const hash = await bcrypt.hash(password, 10)

        const agent = await prisma.agent.create({
            data: {
                username,
                email: identite.email,
                mdp: hash,
                nom: identite.nom,
                nationalite: identite.nationalite,
                photo: identite.photo,
                role: "AGENT",
                habilitation: "CONFIDENTIEL"
            }
        })

        res.status(201).json({
            message: `${agent.nom} a été recruté !`,
            agent
        })
    } catch {
        res.status(400).json({ erreur: "Nom d'utilisateur déjà utilisé" })
    }
})


routerAgents.get("/", authentifier, async (req: Request, res: Response) => {
    const agents = await prisma.agent.findMany({
        orderBy: { createdAt: "asc" }
    })
    res.json(agents)
})


routerAgents.get("/:id", authentifier, async (req: Request, res: Response) => {
    const id = String(req.params.id)

    const agent = await prisma.agent.findUnique({ where: { id } })
    if (!agent) {
        return res.status(404).json({ erreur: "Agent introuvable" })
    }

    res.json(agent)
})


routerAgents.patch("/:id", authentifier, exigerRole("CHEF"), async (req: Request, res: Response) => {
    const id = String(req.params.id)

    try {
        const agent = await prisma.agent.update({
            where: { id },
            data: req.body
        })
        res.json(agent)
    } catch {
        res.status(404).json({ erreur: "Agent introuvable" })
    }
})

export default routerAgents
