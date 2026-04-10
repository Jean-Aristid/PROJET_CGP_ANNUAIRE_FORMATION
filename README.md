# CGP - Annuaire Formation

Application web de gestion de l'annuaire des responsables de formations universitaires.

## Vue d'ensemble

Le projet est compose de trois briques principales :

- `frontend/` : interface React 18 + Vite
- `backend-nest/` : API REST NestJS 11 + Prisma
- `db` : base PostgreSQL 16 orchestree via Docker Compose

Fonctionnalites principales exposees par l'application :

- tableau de bord
- recherche dans l'annuaire
- gestion des responsables, structures et roles
- gestion des delegations
- gestion des annees universitaires
- imports / exports
- organigrammes
- signalements, notifications et audit

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS |
| Backend | NestJS 11, Prisma 7, TypeScript |
| Base de donnees | PostgreSQL 16 |
| Orchestration | Docker Compose |

## Documentation

La documentation projet est centralisee dans `documentation/Manuels/` :

| Document | Lien |
|---|---|
| Manuel complet PDF a suivre en PRIORITÉ | [documentation/Manuels/Manuel_complet_installation_utilisation.pdf](documentation/Manuels/Manuel_complet_installation_utilisation.pdf) |
| Installation | [documentation/Manuels/INSTALLATION.md](documentation/Manuels/INSTALLATION.md) |
| Endpoints API | [documentation/Manuels/API_ENDPOINTS.md](documentation/Manuels/API_ENDPOINTS.md) |
| Tests | [documentation/Manuels/TESTS.md](documentation/Manuels/TESTS.md) |
| Maintenance | [documentation/Manuels/MAINTENANCE.md](documentation/Manuels/MAINTENANCE.md) |
| Maintenance base de donnees | [documentation/Manuels/MAINTENANCE_BASE_DE_DONNEES.md](documentation/Manuels/MAINTENANCE_BASE_DE_DONNEES.md) |
| Manuel utilisateur | [documentation/Manuels/MANUEL_UTILISATEUR.md](documentation/Manuels/MANUEL_UTILISATEUR.md) |


## Arborescence utile

```text
PROJET_CGP_ANNUAIRE_FORMATION/
├── .vscode/
├── backend-nest/
│   ├── dist/
│   │   ├── prisma/
│   │   └── src/
│   │       ├── auth/
│   │       ├── common/
│   │       │   ├── decorators/
│   │       │   ├── filters/
│   │       │   ├── guards/
│   │       │   ├── interceptors/
│   │       │   ├── prisma/
│   │       │   ├── types/
│   │       │   └── utils/
│   │       └── modules/
│   │           ├── affectations/
│   │           │   └── dto/
│   │           ├── annees/
│   │           │   └── dto/
│   │           ├── audit/
│   │           │   └── dto/
│   │           ├── dashboard/
│   │           │   └── dto/
│   │           ├── delegations/
│   │           │   └── dto/
│   │           ├── demandes/
│   │           │   └── dto/
│   │           ├── entites/
│   │           │   └── dto/
│   │           ├── exports/
│   │           │   └── dto/
│   │           ├── imports/
│   │           │   └── dto/
│   │           ├── notifications/
│   │           ├── organigrammes/
│   │           │   └── dto/
│   │           ├── roles/
│   │           │   └── dto/
│   │           ├── search/
│   │           │   └── dto/
│   │           └── users/
│   │               └── dto/
│   ├── files/
│   ├── node_modules/
│   ├── prisma/
│   ├── src/
│   │   ├── auth/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── prisma/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── modules/
│   │       ├── affectations/
│   │       │   └── dto/
│   │       ├── annees/
│   │       │   └── dto/
│   │       ├── audit/
│   │       │   └── dto/
│   │       ├── dashboard/
│   │       │   └── dto/
│   │       ├── delegations/
│   │       │   └── dto/
│   │       ├── demandes/
│   │       │   └── dto/
│   │       ├── entites/
│   │       │   └── dto/
│   │       ├── exports/
│   │       │   └── dto/
│   │       ├── imports/
│   │       │   └── dto/
│   │       ├── notifications/
│   │       ├── organigrammes/
│   │       │   └── dto/
│   │       ├── roles/
│   │       │   └── dto/
│   │       ├── search/
│   │       │   └── dto/
│   │       └── users/
│   │           └── dto/
│   └── test/
├── db-file-csv/
├── documentation/
│   ├── Manuels/
│   └── Rapports_Sprints/
├── files/
│   └── assets/
├── frontend/
│   ├── dist/
│   │   └── assets/
│   ├── node_modules/
│   └── src/
│       ├── components/
│       │   └── ui/
│       ├── lib/
│       └── styles/
└── script/
    ├── __pycache__/
    └── db/
        └── init/
```

## Demarrage rapide avec Docker

```bash
git clone <url-du-depot>
cd PROJET_CGP_ANNUAIRE_FORMATION
docker compose up -d --build
```

Services disponibles :

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001/api |
| Healthcheck | http://localhost:3001/api/health |

Le `docker-compose.yml` demarre :

- `db` : PostgreSQL
- `backend-nest` : API NestJS
- `frontend` : serveur Vite
- `migrate` : service utilitaire Prisma, disponible via le profil `tools`

## Variables d'environnement

Le fichier `.env.example` contient les variables par defaut suivantes :

```env
POSTGRES_DB=CGP
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_PORT=5432
BACKEND_PORT=3001
FRONTEND_PORT=5173
AUTH_MODE=mock
CORS_ORIGINS=http://localhost:5173
```

Notes :

- `AUTH_MODE=mock` active l'authentification de developpement
- `CORS_ORIGINS` controle les origines autorisees par le backend
- en Docker, le frontend proxifie `/api` vers `VITE_API_TARGET` (`http://backend-nest:3001` par defaut)

## Authentification de developpement

En mode `mock`, le backend attend le header HTTP `x-user-login`.

- le frontend envoie automatiquement ce header apres connexion
- l'utilisateur doit exister en base
- les gardes backend appliquent ensuite les controles de role, de perimetre et d'annee

## Commandes utiles

### Docker

```bash
docker compose up -d
docker compose down
docker compose logs -f backend-nest
docker compose exec backend-nest npm run test
docker compose exec backend-nest npm run db:reset
docker compose --profile tools run --rm migrate --name nom_de_la_migration
docker compose --profile tools run --rm migrate deploy
```

### Backend

```bash
cd backend-nest
npm install
npm run start:dev
npm run build
npm run test
npm run test:e2e
npm run seed
npm run seed:csv
npm run db:reset
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run preview
```

## Donnees et seed

Les donnees sources CSV sont stockees dans `db-file-csv/`.

Scripts utiles :

- `script/seed_annuaire.py` : generation du SQL a partir des CSV
- `backend-nest/prisma/seed.ts` : seed Prisma principal
- `backend-nest/prisma/seed-from-csv.ts` : import CSV cote backend

Pour regenerer le seed annuaire a partir des CSV :

```bash
python script/seed_annuaire.py
```

## Verification rapide

Une fois la stack demarree :

```bash
curl http://localhost:3001/api/health
```

La reponse attendue est :

```json
{"status":"ok"}
```
