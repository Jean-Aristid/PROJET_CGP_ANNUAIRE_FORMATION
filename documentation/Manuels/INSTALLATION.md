# Guide d'installation — CGP Annuaire Formation

## Présentation

CGP Annuaire Formation est une application web universitaire composée de :
- **Backend** : NestJS (API REST) + Prisma ORM
- **Base de données** : PostgreSQL 16
- **Frontend** : React 18 + Vite + Tailwind CSS

Deux modes d'installation sont disponibles : **Docker** (recommandé) ou **local**.

---

## Prérequis communs

| Outil | Version minimale | Lien officiel |
|---|---|---|
| Git | 2.x | https://git-scm.com/downloads |
| Docker Desktop | 24.x | https://docs.docker.com/get-docker/ |
| Docker Compose | v2.x (inclus dans Docker Desktop) | https://docs.docker.com/compose/install/ |
| Node.js *(local uniquement)* | 20 LTS | https://nodejs.org/en/download |
| Python *(seed uniquement)* | 3.10+ | https://www.python.org/downloads/ |

---

## Option 1 — Installation avec Docker (recommandée)

Docker lance automatiquement PostgreSQL, le backend NestJS et le frontend React sans rien installer localement.

### Étape 1 — Cloner le dépôt

```bash
git clone <url-du-depot>
cd PROJET_CGP_ANNUAIRE_FORMATION
```

### Étape 2 — Créer le fichier d'environnement

```bash
cp .env.example .env
```

Le fichier `.env` contient les variables suivantes (modifiables selon vos besoins) :

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

> **AUTH_MODE=mock** : en mode développement, l'authentification est simulée via un header HTTP. Aucun serveur CAS requis.

### Étape 3 — Lancer les services

```bash
docker compose up --build
```

Docker construit les images et démarre les services dans l'ordre suivant :
1. `db` — PostgreSQL avec initialisation automatique des données
2. `backend-nest` — API NestJS (attend que `db` soit healthy)
3. `frontend` — Serveur de développement Vite (attend que `backend` soit healthy)

### Étape 4 — Vérifier que tout fonctionne

| Service | URL | Description |
|---|---|---|
| Frontend | http://localhost:5173 | Interface utilisateur |
| Backend API | http://localhost:3001/api | API REST |
| Health check | http://localhost:3001/api/health | Statut du backend |

---

## Option 2 — Installation locale (sans Docker)

### Prérequis supplémentaires

- PostgreSQL 16 installé et en cours d'exécution  
  Lien : https://www.postgresql.org/download/

### Étape 1 — Cloner et configurer l'environnement

```bash
git clone <url-du-depot>
cd PROJET_CGP_ANNUAIRE_FORMATION
cp .env.example .env
# Ajustez DATABASE_URL dans .env selon votre installation PostgreSQL
```

### Étape 2 — Créer la base de données

```bash
# Dans psql ou pgAdmin, créer la base :
createdb -U postgres CGP
```

### Étape 3 — Backend NestJS

```bash
cd backend-nest
npm install
npx prisma migrate deploy   # applique les migrations
npm run seed                # seed initial (types diplômes, rôles)
npm run start:dev           # démarre en mode développement
```

Le backend écoute sur http://localhost:3001

### Étape 4 — Frontend React

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev
```

Le frontend écoute sur http://localhost:5173

### Étape 5 — Charger les données CSV (optionnel)

Pour peupler la base avec les données de l'annuaire à partir des fichiers CSV :

```bash
# À la racine du projet
python script/seed_annuaire.py
```

Ce script lit les fichiers dans `db-file-csv/` et génère les fichiers SQL suivants :
- `script/annuaire_seed.sql` — rechargement manuel
- `script/db/init/999_annuaire_seed.sql` — utilisé par Docker au premier démarrage

---

## Structure des services Docker

```yaml
services:
  db:            # PostgreSQL 16 — port 5433 (externe), 5432 (interne)
  backend-nest:  # NestJS API — port 3001
  frontend:      # React/Vite dev server — port 5173
  migrate:       # Service utilitaire Prisma (profil: tools)
```

### Commandes Docker utiles

```bash
# Démarrer les services en arrière-plan
docker compose up -d

# Arrêter les services
docker compose down

# Voir les logs d'un service
docker compose logs -f backend-nest

# Redémarrer un service
docker compose restart backend-nest

# Accéder au shell du backend
docker compose exec backend-nest sh

# Créer une migration Prisma
docker compose run --rm migrate --name nom_de_la_migration

# Réinitialiser la base de données
docker compose exec backend-nest npm run db:reset
```

---

## Variables d'environnement — Référence complète

| Variable | Valeur par défaut | Description |
|---|---|---|
| `POSTGRES_DB` | `CGP` | Nom de la base PostgreSQL |
| `POSTGRES_USER` | `postgres` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | `1234` | Mot de passe PostgreSQL |
| `POSTGRES_PORT` | `5432` | Port PostgreSQL (interne Docker) |
| `BACKEND_PORT` | `3001` | Port exposé pour l'API |
| `FRONTEND_PORT` | `5173` | Port exposé pour le frontend |
| `AUTH_MODE` | `mock` | Mode d'authentification (`mock` ou `cas`) |
| `CORS_ORIGINS` | `http://localhost:5173` | Origines autorisées pour CORS |
| `DATABASE_URL` | *(construit depuis les autres vars)* | URL de connexion Prisma |

---

## Dépannage courant

| Problème | Solution |
|---|---|
| Port déjà utilisé | Modifier `BACKEND_PORT` ou `FRONTEND_PORT` dans `.env` |
| `db` ne démarre pas | Vérifier que Docker est en cours d'exécution |
| Migrations non appliquées | `docker compose exec backend-nest npx prisma migrate deploy` |
| Frontend ne se connecte pas au backend | Vérifier que `CORS_ORIGINS` correspond à l'URL du frontend |
| Données manquantes | Lancer `python script/seed_annuaire.py` puis redémarrer `db` |
