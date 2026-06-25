import { Router, type Request, type Response } from "express"

import bcrypt from "bcryptjs"
import prisma from "../../utils/prisma.js"
import jwt from "jsonwebtoken"

const routerAuth = Router()

routerAuth.post("/inscription", async (req:Request, res: Response) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({erreur: "Courriel ou mot de passe manquant !"})
    }

    try {
        const pass_hash = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({data : {username, password: pass_hash}})
        res.status(201).json({id: user.id, role: user.role, createdAt: user.createdAt})

    } catch {
        res.status(400).json({erreur : "Cet identifiant est deja utilisé"})
    }
})

routerAuth.post("/connexion",async(req:Request, res:Response)=>{
    const {username, password} = req.body 

    const user = await prisma.user.findUnique({ where : {username}})
    if(!user) return res.status(401).json({erreur: "Mot de passe ou nom d'utilisateur invalide"})
    
    const ok = await bcrypt.compare(password, user.password)
    if(!ok) return res.status(401).json({erreur: "Mot de passe ou nom d'utilisateur invalide"})

    const token = jwt.sign(
        {sub: user.id, role: user.role},
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    )
    res.json({token})
})