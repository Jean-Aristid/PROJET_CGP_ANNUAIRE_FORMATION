# CGP - Annuaire Formation

Application web de gestion d'annuaire universitaire orientee structures, responsables, annees universitaires et organigrammes.

Etat de la documentation: avril 2026.

## Vue d'ensemble

Le projet couvre notamment:

- la recherche avancee de responsables, formations, structures et secretariats
- la recherche sur toute la base pour les profils globaux autorises
- la gestion des utilisateurs, affectations, contacts fonctionnels et delegations
- la gestion des fiches structures avec champs specifiques par type
- la gestion des annees universitaires
- la generation, la consultation et l'export d'organigrammes
- l'import et l'export de donnees metier
- la gestion des signalements, notifications et journaux d'audit

## Stack

- `frontend/`: React + Vite + TypeScript
- `backend-nest/`: NestJS + Prisma + TypeScript
- `db`: PostgreSQL 16
- `docker-compose.yml`: orchestration locale

## Regle de travail

Le projet se travaille en priorite via Docker.

En pratique:

- ne pas compter sur `npm` en local sur la machine hote
- lancer le frontend, le backend et la base via `docker compose`
- executer les commandes de build, test et maintenance dans les conteneurs

## Demarrage rapide

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend-nest
```

Services exposes par defaut:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3001/api/health`
- postgres: `localhost:5433`

Etat attendu:

- `db`: `healthy`
- `backend-nest`: `healthy`
- `frontend`: demarre

## Commandes utiles

Voir l'etat des conteneurs:

```bash
docker compose ps
```

Voir les logs:

```bash
docker compose logs -f
docker compose logs -f backend-nest
docker compose logs -f frontend
docker compose logs -f db
```

Verifier les builds une fois la stack demarree:

```bash
docker compose exec frontend sh -lc "npm run build"
docker compose exec backend-nest sh -lc "npm run build"
```

Lancer les tests backend:

```bash
docker compose exec backend-nest sh -lc "npm run test"
docker compose exec backend-nest sh -lc "npm run test:e2e"
```

Arreter la stack:

```bash
docker compose down
```

Reinitialiser completement la base locale:

```bash
docker compose down -v
docker compose up -d --build
```

## Fonctionnalites cles

### Recherche

- ecran de recherche multi-onglets: responsables, formations, structures, secretariats
- filtres hierarchiques dynamiques composante vers niveau
- recherche globale sur une annee ou sur toute la base pour `services-centraux` et `administrateur`
- nettoyage des anciens parametres `ds_*` et `dg_*` sur les ecrans sensibles

### Gestion des responsables

- edition des informations personne: email principal, email secondaire, civilite, categorie, telephone, bureau
- ajout et suppression d'affectations selon les droits
- edition d'une affectation existante: role, structure d'affectation, dates, coordonnees fonctionnelles

### Fiches structures

- consultation detaillee des composantes, departements, mentions, parcours et niveaux
- edition reservee aux services centraux
- champs metier couverts selon le type:
  code composante, type composante, campus, mails, site web, code interne, type diplome, cycle, code parcours, libelle court

### Delegations

- creation reservee aux profils de direction autorises
- choix du perimetre assiste par filtres hierarchiques dynamiques
- pour les profils non centraux, seules les structures d'affectation directe peuvent etre choisies a la creation
- droits supportes:
  `view`, `manage_responsables`, `assign_role`, `validate_signalement`, `generate_orgchart`, `import_data`, `full`
- export CSV reserve aux services centraux

### Annees, imports et organigrammes

- changement d'annee reserve aux services centraux
- import et export metier via workbook standardise
- organigrammes en vue structures et personnes, avec exports et bibliotheque

## Documentation

La documentation detaillee se trouve dans [documentation/README.md](./documentation/README.md).

Points d'entree principaux:

- [documentation/MANUEL_UTILISATEUR.md](./documentation/MANUEL_UTILISATEUR.md)
- [documentation/MANUEL_TECHNIQUE.md](./documentation/MANUEL_TECHNIQUE.md)
- [documentation/API_BACKEND.md](./documentation/API_BACKEND.md)
- [documentation/EXPLOITATION_MAINTENANCE.md](./documentation/EXPLOITATION_MAINTENANCE.md)
- [documentation/RECETTE_TEST.md](./documentation/RECETTE_TEST.md)

## Architecture rapide

```text
Navigateur
  -> frontend React / Vite
  -> API NestJS (/api)
  -> Prisma
  -> PostgreSQL
```

Organisation du depot:

```text
.
|-- backend-nest/
|-- frontend/
|-- documentation/
|-- files/
|-- script/
`-- docker-compose.yml
```

## Authentification en developpement

Le projet tourne par defaut avec `AUTH_MODE=mock`.

Concretement:

- le frontend stocke le login en local
- chaque appel API envoie `x-user-login`
- le backend reconstruit l'utilisateur courant a partir de la base

Il faut donc utiliser un login reellement present dans la table `utilisateur`.

Exemple de verification:

```bash
curl -i -H "x-user-login: alain.rousseau" http://localhost:5173/api/auth/me
```

## Variables d'environnement

Un exemple est disponible dans [.env.example](./.env.example).

Variables principales:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_PORT`
- `BACKEND_PORT`
- `FRONTEND_PORT`
- `AUTH_MODE`
- `CORS_ORIGINS`

## Contribution

Avant de livrer une evolution:

- mettre a jour la documentation si le comportement change
- verifier les builds Docker
- verifier les droits d'acces si une route ou un ecran change
- valider les parcours impactes en recette manuelle
