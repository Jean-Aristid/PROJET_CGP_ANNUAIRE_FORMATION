# Backend NestJS - CGP

Backend API du projet `CGP - Annuaire Formation`.

## Role du backend

Le backend expose l'API metier pour:

- l'authentification mock en developpement
- la recherche annuaire
- la gestion des utilisateurs, affectations et structures
- la gestion des delegations, signalements et notifications
- la gestion des annees universitaires
- les imports, exports et organigrammes

## Stack

- NestJS 11
- Prisma 7
- PostgreSQL 16
- TypeScript

## Regle de travail

Le backend se lance et se verifie de preference via Docker.

Workflow recommande:

```bash
docker compose up -d --build
docker compose exec backend-nest sh -lc "npm run build"
docker compose exec backend-nest sh -lc "npm run test"
```

## Scripts utiles

```bash
npm run start:dev
npm run start:docker
npm run build
npm run test
npm run test:e2e
npm run seed
npm run seed:csv
npm run db:reset
```

## Particularite du demarrage Docker

`npm run start:docker` execute:

1. `prisma generate`
2. `npm run docker:init`
3. `nest start --watch`

## Authentification mock

En developpement:

- le frontend envoie `x-user-login`
- le backend recharge l'utilisateur courant depuis la base
- les roles, portees et annees sont ensuite controles par les gardes et les services metier

## Modules metier principaux

- `auth`
- `users`
- `roles`
- `entites`
- `affectations`
- `search`
- `delegations`
- `organigrammes`
- `annees`
- `imports`
- `exports`
- `notifications`
- `audit`

## Documentation projet

Voir la documentation centrale:

- [../README.md](../README.md)
- [../documentation/API_BACKEND.md](../documentation/API_BACKEND.md)
- [../documentation/MANUEL_TECHNIQUE.md](../documentation/MANUEL_TECHNIQUE.md)
- [../documentation/EXPLOITATION_MAINTENANCE.md](../documentation/EXPLOITATION_MAINTENANCE.md)
