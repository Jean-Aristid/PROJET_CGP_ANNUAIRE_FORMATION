# PROJET_CGP_ANNUAIRE_FORMATION

## Stack

- `frontend/` : React (Vite) — UI
- `backend/` : Node.js (Express) — API
- `script/db/` : scripts SQL Postgres (init)

## Docker (React + Node + PostgreSQL)

- Scripts SQL d'init : `script/db/` (exécutés au 1er démarrage de Postgres)
- Front : http://localhost:5173
- Back : http://localhost:3001/api/health
- Postgres : localhost:5432

### Démarrage

```bash
cp .env.example .env
docker compose up --build
```

### Lancer un service (optionnel)

```bash
docker compose up --build frontend
docker compose up --build backend
docker compose up --build db
```

### Réinitialiser la base (rejouer les scripts `script/db/`)

```bash
docker compose down -v
docker compose up --build
```

## Sans Docker (local)

### Backend

```bash
cd backend
npm install
npm run dev
```

Variables utiles (si Postgres tourne en local) : `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Note : en local, le proxy `/api` dans `frontend/vite.config.js` doit pointer vers `http://localhost:3001` (au lieu de `http://backend:3001`).

## Dépannage Docker (Ubuntu)

Si `Cannot connect to the Docker daemon` :

```bash
sudo systemctl enable --now docker
sudo systemctl restart docker
```

Si `permission denied` sur `/var/run/docker.sock` :

```bash
getent group docker || sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```
