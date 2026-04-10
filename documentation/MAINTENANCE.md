# Maintenance générale — CGP Annuaire Formation

## Vue d'ensemble

Ce document couvre la maintenance opérationnelle de l'application : surveillance des services, gestion des logs, mises à jour, sauvegardes et procédures de reprise.

Pour la maintenance spécifique à la base de données (migrations, seed, schéma), voir [MAINTENANCE_BASE_DE_DONNEES.md](MAINTENANCE_BASE_DE_DONNEES.md).

---

## Surveillance des services

### Vérifier l'état des conteneurs Docker

```bash
# État de tous les services
docker compose ps

# Détail avec ports et santé
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

### Health checks

| Service | Endpoint / Commande | Réponse attendue |
|---|---|---|
| Backend API | `GET http://localhost:3001/api/health` | `{ "status": "ok", "db": "connected" }` |
| Base de données | `docker compose exec db pg_isready -U postgres` | `accepting connections` |
| Frontend | `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` | `200` |

### Vérifier la santé depuis la ligne de commande

```bash
# Health check API complet
curl http://localhost:3001/api/health

# Vérifier que PostgreSQL accepte les connexions
docker compose exec db pg_isready -U postgres -d CGP

# Ping du frontend
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
```

---

## Gestion des logs

### Consulter les logs en temps réel

```bash
# Tous les services
docker compose logs -f

# Backend uniquement
docker compose logs -f backend-nest

# Base de données uniquement
docker compose logs -f db

# Frontend uniquement
docker compose logs -f frontend
```

### Consulter les N dernières lignes

```bash
# 100 dernières lignes du backend
docker compose logs --tail=100 backend-nest

# Depuis une date précise
docker compose logs --since="2024-11-15T10:00:00" backend-nest
```

### Journal d'audit applicatif

Les actions utilisateurs sont enregistrées dans la table `journal_audit` de la base de données. Pour les consulter via l'interface :
- Aller dans **Paramètres** → **Journal d'audit** (Services Centraux uniquement)
- Ou exporter via `GET /api/audit/export`

Pour consulter directement en base :
```sql
SELECT * FROM journal_audit ORDER BY horodatage DESC LIMIT 50;
```

---

## Démarrage et arrêt des services

### Démarrer les services

```bash
# Démarrage complet avec reconstruction des images
docker compose up --build

# Démarrage en arrière-plan
docker compose up -d

# Démarrer uniquement certains services
docker compose up -d db backend-nest
```

### Arrêter les services

```bash
# Arrêter sans supprimer les volumes (données conservées)
docker compose down

# Arrêter et supprimer les volumes (perte des données)
docker compose down -v
```

### Redémarrer un service

```bash
# Redémarrer le backend (utile après un changement de config)
docker compose restart backend-nest

# Redémarrer la base de données
docker compose restart db
```

### Reconstruire une image après modification du code

```bash
# Reconstruire et relancer uniquement le backend
docker compose up -d --build backend-nest

# Reconstruire et relancer le frontend
docker compose up -d --build frontend
```

---

## Mises à jour

### Mettre à jour les dépendances Node.js

```bash
# Vérifier les mises à jour disponibles (backend)
docker compose exec backend-nest npm outdated

# Mettre à jour les dépendances (backend)
docker compose exec backend-nest npm update

# Même procédure pour le frontend
docker compose exec frontend npm outdated
docker compose exec frontend npm update
```

### Appliquer une nouvelle version de l'application

```bash
# 1. Récupérer les dernières modifications
git pull origin main

# 2. Reconstruire les images Docker
docker compose build

# 3. Relancer les services
docker compose up -d

# 4. Appliquer les nouvelles migrations si nécessaire
docker compose exec backend-nest npm run migrate:deploy
```

---

## Sauvegardes

### Sauvegarde de la base de données

```bash
# Dump complet de la base PostgreSQL
docker compose exec db pg_dump -U postgres CGP > backup_$(date +%Y%m%d_%H%M%S).sql

# Dump compressé (recommandé pour les grandes bases)
docker compose exec db pg_dump -U postgres -Fc CGP > backup_$(date +%Y%m%d_%H%M%S).dump
```

### Restaurer une sauvegarde

```bash
# Depuis un fichier SQL
docker compose exec -T db psql -U postgres -d CGP < backup_20241115.sql

# Depuis un fichier dump compressé
docker compose exec -T db pg_restore -U postgres -d CGP backup_20241115.dump
```

### Sauvegarder les fichiers CSV source

Les fichiers CSV dans `db-file-csv/` sont la source de données de l'annuaire. Les inclure dans les sauvegardes :

```bash
tar -czf csv_backup_$(date +%Y%m%d).tar.gz db-file-csv/
```

### Politique de sauvegarde recommandée

| Fréquence | Type | Rétention |
|---|---|---|
| Quotidienne | Dump PostgreSQL compressé | 7 jours |
| Hebdomadaire | Dump PostgreSQL + CSV | 1 mois |
| Mensuelle | Dump complet + code source | 1 an |

---

## Gestion de l'espace disque

### Vérifier l'espace utilisé par Docker

```bash
# Résumé global
docker system df

# Détail par volume
docker system df -v | grep -E "VOLUME|db-data"
```

### Vérifier la taille de la base de données

```bash
# Taille totale de la base
docker compose exec db psql -U postgres -d CGP -c "SELECT pg_size_pretty(pg_database_size('CGP'));"

# Taille par table
docker compose exec db psql -U postgres -d CGP -c "
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::regclass))
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;"
```

### Nettoyer les ressources Docker inutilisées

```bash
# Supprimer les images, conteneurs et réseaux inutilisés
docker system prune

# Supprimer aussi les volumes orphelins (attention : perte de données possible)
docker system prune --volumes
```

---

## Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs d'erreur
docker compose logs backend-nest

# Cas fréquents :
# - La base de données n'est pas encore prête → attendre quelques secondes
# - Migrations non appliquées → docker compose exec backend-nest npm run migrate:deploy
# - Port déjà utilisé → modifier BACKEND_PORT dans .env
```

### La base de données refuse les connexions

```bash
# Vérifier l'état du conteneur db
docker compose ps db

# Vérifier les logs PostgreSQL
docker compose logs db

# Redémarrer le conteneur
docker compose restart db

# Vérifier la connexion manuellement
docker compose exec db psql -U postgres -d CGP -c "SELECT 1;"
```

### Le frontend ne se charge pas

```bash
# Vérifier que le backend répond
curl http://localhost:3001/api/health

# Vérifier les variables CORS
# Dans .env : CORS_ORIGINS doit contenir http://localhost:5173

# Voir les logs frontend
docker compose logs frontend
```

### Erreurs de migration Prisma

```bash
# Voir l'état des migrations
docker compose exec backend-nest npx prisma migrate status

# Résoudre une migration bloquée
docker compose exec backend-nest npx prisma migrate resolve --applied <nom_migration>

# En dernier recours : reset complet (perte de données)
docker compose exec backend-nest npm run db:reset
```

### Performances dégradées

```bash
# Vérifier la consommation des conteneurs
docker stats

# Analyser les requêtes lentes PostgreSQL
docker compose exec db psql -U postgres -d CGP -c "
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;"
```

---

## Mise à jour du référentiel CSV

Lorsque de nouveaux fichiers CSV sont disponibles (nouvelles composantes, formations…) :

```bash
# 1. Placer les nouveaux fichiers dans db-file-csv/

# 2. Régénérer les fichiers SQL
python script/seed_annuaire.py

# 3a. Via Docker : relancer la base pour appliquer le nouveau seed
docker compose down
docker compose up -d

# 3b. Ou appliquer manuellement sans redémarrer
docker compose exec db psql -U postgres -d CGP -f /path/to/999_annuaire_seed.sql
```

---

## Accès direct aux services

### Shell du backend

```bash
docker compose exec backend-nest sh
```

### Console PostgreSQL (psql)

```bash
docker compose exec db psql -U postgres -d CGP
```

### Prisma Studio (interface visuelle de la BDD)

```bash
# En local uniquement
cd backend-nest
npx prisma studio
# Ouvre http://localhost:5555
```

---

## Checklist de mise en production

Avant de déployer une nouvelle version :

- [ ] Les tests unitaires passent : `npm run test`
- [ ] Les tests E2E passent : `npm run test:e2e`
- [ ] Les migrations sont prêtes : `npx prisma migrate status`
- [ ] Le fichier `.env` de production est configuré correctement
- [ ] `AUTH_MODE` n'est **pas** en `mock` en production
- [ ] `CORS_ORIGINS` est restreint aux domaines de production
- [ ] Les mots de passe PostgreSQL ont été changés (`POSTGRES_PASSWORD`)
- [ ] Une sauvegarde de la base actuelle a été effectuée
- [ ] Le build frontend de production est généré : `npm run build`
