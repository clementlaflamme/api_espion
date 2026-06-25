import express from "express"
import dotenv from "dotenv"
import routerAgents from "./routes/agents.routes.js"
import routerAuth from "./routes/auth.routes.js"

dotenv.config()

const app = express()
app.use(express.json())

app.use("/auth", routerAuth)
app.use("/agents", routerAgents) 

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}/`)
})
