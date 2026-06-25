[Operation: Backend Secret]

Petit backend pour gérer les agents et les missions d'une organisation secrète.


🚀 Technologies utilisées

    - Node
    - Express
    - Prisma + Neon
    - Axios
    - JWT + bcrypt


🛠️ Prérequis

Vous devez avoir:

  - Node.js
  - Une instance de base de données Neon (neon.com), c'est gratuit.


⚙️ Installation et Configuration:

    git clone https://github.com/clementlaflamme/api_espion.git
    cd api_espion

Installer les dépendances:

    npm install

Configuration des variables d'environnement :

    Crée un fichier .env à la racine du backend du projet et ajouter le lien vers Neon. Voir .env.example.

Initialiser Prisma (Base de données) :
Génère le client Prisma et lance les migrations pour créer les tables :

    npx prisma generate
    npx prisma migrate dev --name init

Lancer le serveur:

    npm run dev


🌐 Services externes

    Random User Generator : http://randomuser.me/api/


👤 Agents auteurs

    Clément Laflamme
    Francis Boisvert
    Mathieu Gosselin
    Pascale Mercier