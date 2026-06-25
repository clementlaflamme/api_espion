/* 
============================================================
CE FICHIER DE TEST A ÉTÉ GÉNÉRÉ PAR UNE INTELLIGENCE
ARTIFICIELLE (Gemini) PUISQUE NOUS AVONS MANQUÉ DE TEMPS
============================================================
*/

import axios from "axios";

const API_URL = "http://localhost:3000";

// Variables globales pour le cycle de vie des tests
let tokenAgent = "";
let tokenChef = "";
let idAgent = "";
let idMissionSecrete = 0;
let idMissionConfidentielle = 0;

// Utilitaire pour afficher les erreurs proprement
function handleError(error: any, testName: string) {
  console.error(`\n❌ ÉCHEC : ${testName}`);
  if (error.response) {
    console.error(`Status HTTP: ${error.response.status}`);
    console.error("Détails :", error.response.data);
  } else {
    console.error(error.message);
  }
}

async function runTests() {
  console.log("🚀 Démarrage de la suite de tests de l'API Espion...\n");

  const timestamp = Date.now();
  const chefUsername = `chef_${timestamp}`;
  const agentUsername = `agent_${timestamp}`;
  const password = "secretpassword";

  // ====================================================================
  // 1. AUTHENTIFICATION & CRÉATION
  // ====================================================================

  try {
    console.log("--- TEST 1 : Inscription d'un CHEF ---");
    const resInscriptionChef = await axios.post(`${API_URL}/auth/inscription`, {
      username: chefUsername,
      password: password,
      role: "CHEF",
      habilitation: "TRES_SECRET",
    });
    console.log(
      `✅ Succès (201) : Chef créé avec l'ID ${resInscriptionChef.data.id}`,
    );

    console.log("\n--- TEST 2 : Inscription d'un AGENT ---");
    const resInscriptionAgent = await axios.post(
      `${API_URL}/auth/inscription`,
      {
        username: agentUsername,
        password: password,
        role: "AGENT",
        habilitation: "CONFIDENTIEL",
      },
    );
    idAgent = resInscriptionAgent.data.id;
    console.log(`✅ Succès (201) : Agent créé avec l'ID ${idAgent}`);

    console.log("\n--- TEST 3 : Connexion du Chef ---");
    const resConnChef = await axios.post(`${API_URL}/auth/connexion`, {
      username: chefUsername,
      password: password,
    });
    tokenChef = resConnChef.data.token;
    console.log("✅ Succès (200) : Token Chef récupéré");

    console.log("\n--- TEST 4 : Connexion de l'Agent ---");
    const resConnAgent = await axios.post(`${API_URL}/auth/connexion`, {
      username: agentUsername,
      password: password,
    });
    tokenAgent = resConnAgent.data.token;
    console.log("✅ Succès (200) : Token Agent récupéré");
  } catch (e) {
    return handleError(e, "Étape d'authentification");
  }

  // ====================================================================
  // 2. TESTS DES PERMISSIONS (RBAC)
  // ====================================================================

  try {
    console.log(
      "\n--- TEST 5 : L'Agent essaie de créer une mission (Doit échouer) ---",
    );
    await axios.post(
      `${API_URL}/missions/creer`,
      { titre: "Mission illégale", description: "...", recompense: "0" },
      { headers: { Authorization: `Bearer ${tokenAgent}` } },
    );
    console.error(
      "❌ ÉCHEC : L'agent a réussi à créer une mission ! La route n'est pas sécurisée.",
    );
  } catch (e: any) {
    if (e.response && e.response.status === 403) {
      console.log("✅ Succès (403) : Accès refusé à l'Agent comme prévu.");
    } else {
      handleError(e, "Test permission Agent (Création mission)");
    }
  }

  // ====================================================================
  // 3. GESTION DES MISSIONS & HABILITATIONS
  // ====================================================================

  try {
    console.log("\n--- TEST 6 : Le Chef crée une mission CONFIDENTIELLE ---");
    const resMissConf = await axios.post(
      `${API_URL}/missions/creer`,
      {
        titre: "Surveillance du port",
        description: "Observer les allées et venues.",
        recompense: "1000",
        nivConfidentialite: "CONFIDENTIEL",
      },
      { headers: { Authorization: `Bearer ${tokenChef}` } },
    );
    idMissionConfidentielle = resMissConf.data.mission.id;
    console.log("✅ Succès (201) : Mission confidentielle créée.");

    console.log("\n--- TEST 7 : Le Chef crée une mission TRES_SECRET ---");
    const resMissSec = await axios.post(
      `${API_URL}/missions/creer`,
      {
        titre: "Infiltration QG",
        description: "Récupérer les disques durs.",
        recompense: "50000",
        nivConfidentialite: "TRES_SECRET",
      },
      { headers: { Authorization: `Bearer ${tokenChef}` } },
    );
    idMissionSecrete = resMissSec.data.mission.id;
    console.log("✅ Succès (201) : Mission très secrète créée.");

    console.log(
      "\n--- TEST 8 : L'Agent consulte les missions (Filtre Habilitation) ---",
    );
    const resMissionsAgent = await axios.get(`${API_URL}/missions`, {
      headers: { Authorization: `Bearer ${tokenAgent}` },
    });

    const missionsRecues = resMissionsAgent.data;
    const aAccesTresSecret = missionsRecues.some(
      (m: any) => m.nivConfidentialite === "TRES_SECRET",
    );

    if (aAccesTresSecret) {
      console.error("❌ ÉCHEC : L'Agent peut voir les missions TRES_SECRET !");
    } else {
      console.log(
        `✅ Succès (200) : L'Agent voit ${missionsRecues.length} mission(s). Les missions TRES_SECRET sont bien cachées.`,
      );
    }

    console.log("\n--- TEST 9 : Le Chef assigne la mission à l'Agent ---");
    await axios.patch(
      `${API_URL}/missions/assigner`,
      { id_mission: idMissionConfidentielle, id_agent: idAgent },
      { headers: { Authorization: `Bearer ${tokenChef}` } },
    );
    console.log("✅ Succès (200) : Mission assignée à l'Agent.");
  } catch (e) {
    handleError(e, "Gestion des missions");
  }

  // ====================================================================
  // 4. GESTION DES AGENTS
  // ====================================================================

  try {
    console.log("\n--- TEST 10 : Récupérer la liste de tous les agents ---");
    const resAgents = await axios.get(`${API_URL}/agents`, {
      headers: { Authorization: `Bearer ${tokenChef}` },
    });
    console.log(
      `✅ Succès (200) : ${resAgents.data.length} agent(s) trouvé(s).`,
    );

    console.log(
      "\n--- TEST 11 : Récupérer les détails d'un agent spécifique ---",
    );
    const resAgentDetails = await axios.get(`${API_URL}/agents/${idAgent}`, {
      headers: { Authorization: `Bearer ${tokenChef}` },
    });
    console.log(
      `✅ Succès (200) : Détails récupérés pour ${resAgentDetails.data.nom}.`,
    );

    console.log("\n--- TEST 12 : Le Chef modifie le profil d'un agent ---");
    await axios.patch(
      `${API_URL}/agents/${idAgent}`,
      { habilitation: "SECRET" },
      { headers: { Authorization: `Bearer ${tokenChef}` } },
    );
    console.log(
      "✅ Succès (200) : Profil de l'agent mis à jour (Habilitation augmentée).",
    );
  } catch (e) {
    handleError(e, "Gestion des agents");
  }

  // ====================================================================
  // 5. NETTOYAGE (DELETE)
  // ====================================================================

  try {
    console.log("\n--- TEST 13 : Le Chef supprime une mission ---");
    await axios.delete(`${API_URL}/missions/supprimer/${idMissionSecrete}`, {
      headers: { Authorization: `Bearer ${tokenChef}` },
    });
    console.log("✅ Succès : Mission supprimée proprement.");
  } catch (e) {
    handleError(e, "Suppression de mission");
  }

  console.log("\n🎉 Fin des tests !");
}

runTests();
