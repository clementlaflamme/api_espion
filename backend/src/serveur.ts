import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import routerAgents from "./routes/agents.routes.js";
import routerAuth from "./routes/auth.routes.js";
import routerMissions from "./routes/missions.routes.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", routerAuth);
app.use("/agents", routerAgents);
app.use("/missions", routerMissions);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Serveur fonctionnel !" });
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Serveur sur le http://localhost:${PORT}/`);
});
