# CGP — Annuaire Formation

Application web de gestion de l'annuaire des responsables de formations universitaires.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | NestJS 11 + Prisma ORM |
| Base de données | PostgreSQL 16 |
| Orchestration | Docker + Docker Compose |

## Démarrage rapide (Docker)

```bash
# 1. Cloner le dépôt
git clone <url-du-depot>
cd PROJET_CGP_ANNUAIRE_FORMATION

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Lancer tous les services
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API Backend | http://localhost:3001/api |
| Health check | http://localhost:3001/api/health |

## Documentation

| Document | Description |
|---|---|
| [Installation](documentation/INSTALLATION.md) | Guide complet d'installation (Docker et local) |
| [API Endpoints](documentation/API_ENDPOINTS.md) | Référence de toutes les routes de l'API |
| [Tests](documentation/TESTS.md) | Lancer et écrire les tests |
| [Maintenance générale](documentation/MAINTENANCE.md) | Surveillance, logs, sauvegardes, dépannage, mises à jour |
| [Maintenance & Base de données](documentation/MAINTENANCE_BASE_DE_DONNEES.md) | Schéma BDD, migrations, seed, commandes Prisma |
| [Manuel utilisateur](documentation/MANUEL_UTILISATEUR.md) | Guide d'utilisation de l'application |

## Commandes utiles

```bash
# Voir les logs du backend
docker compose logs -f backend-nest

# Lancer les tests unitaires
docker compose exec backend-nest npm run test

# Générer le seed depuis les CSV
python script/seed_annuaire.py

# Réinitialiser la base de données
docker compose exec backend-nest npm run db:reset

# Créer une migration Prisma
docker compose run --rm migrate --name nom_de_la_migration
```

## Authentification

En mode développement, l'authentification est simulée (`AUTH_MODE=mock`).  
Le header `x-user-login: <login>` identifie l'utilisateur courant — aucun serveur CAS requis.
