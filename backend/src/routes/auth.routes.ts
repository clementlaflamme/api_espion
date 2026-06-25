import { Router, type Request, type Response } from "express"
import bcrypt from "bcryptjs"
import prisma from "../../utils/prisma.js"
import jwt from "jsonwebtoken"
import axios from "axios"

const routerAuth = Router()


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
        console.log("Erreur RandomUser :", e)
        return null
    }
}


routerAuth.post("/inscription", async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ erreur: "Champs manquants !" })
    }


    const identite = await recupererIdentite()
    if (!identite) {
        return res.status(500).json({ erreur: "Impossible de générer une identité" })
    }

    try {

        const pass_hash = await bcrypt.hash(password, 10)

        const agent = await prisma.agent.create({
            data: {
                username,
                email: identite.email,
                mdp: pass_hash,
                nom: identite.nom,
                nationalite: identite.nationalite,
                photo: identite.photo,
                role: "AGENT",
                habilitation: "CONFIDENTIEL"
            }
        })

        res.status(201).json({
            id: agent.id,
            role: agent.role,
            createdAt: agent.createdAt
        })

    } catch (error) {
        res.status(400).json({ erreur: `${error}` })
    }
})

routerAuth.post("/connexion", async (req: Request, res: Response) => {
    const { username, password } = req.body

    const agent = await prisma.agent.findUnique({ where: { username } })
    if (!agent) {
        return res.status(401).json({ erreur: "Mot de passe ou nom d'utilisateur invalide" })
    }

    const ok = await bcrypt.compare(password, agent.mdp)
    if (!ok) {
        return res.status(401).json({ erreur: "Mot de passe ou nom d'utilisateur invalide" })
    }

    const token = jwt.sign(
        { sub: agent.id, role: agent.role, habilitation: agent.habilitation },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    )

    res.json({ token })
})

export default routerAuth
