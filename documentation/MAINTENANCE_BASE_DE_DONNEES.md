# Maintenance et base de données — CGP Annuaire Formation

## Architecture de la base de données

La base de données est **PostgreSQL 16**. Elle est gérée via **Prisma ORM** (v7.3).

- **Schéma Prisma** : `backend-nest/prisma/schema.prisma`
- **Migrations** : `backend-nest/prisma/migrations/`
- **Seed initial** : `backend-nest/prisma/seed.ts` et `backend-nest/prisma/seed-from-csv.ts`

---

## Schéma de la base de données

### Énumérations (Enums)

| Enum | Valeurs |
|---|---|
| `annee_statut` | `EN_COURS`, `PREPARATION`, `ARCHIVEE` |
| `composante_type` | `UFR`, `INSTITUT`, `IUT` |
| `delegation_statut` | `ACTIVE`, `EXPIREE`, `ANNULEE` |
| `demande_statut` | `EN_ATTENTE`, `VALIDEE`, `REFUSEE` |
| `entite_type` | `COMPOSANTE`, `DEPARTEMENT`, `MENTION`, `PARCOURS`, `NIVEAU` |
| `signalement_statut` | `OUVERT`, `EN_COURS`, `CLOTURE` |
| `utilisateur_categorie` | `EC`, `BIATSS`, `ESAS`, `CONTRACTUEL`, `VACATAIRE` |
| `utilisateur_genre` | `M`, `F` |
| `utilisateur_statut` | `ACTIF`, `INACTIF` |
| `personne_externe_statut` | `ANCIEN_ETUDIANT`, `PROFESSIONNEL` |

---

### Tables

#### `utilisateur` — Utilisateurs

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id_user` | `BigInt` | PK, auto-incrémenté | Identifiant interne |
| `login` | `String` | Unique | Login CAS de l'utilisateur |
| `uid_cas` | `String?` | — | UID SSO CAS |
| `nom` | `String` | — | Nom de famille |
| `prenom` | `String` | — | Prénom |
| `genre` | `utilisateur_genre?` | — | Genre (`M` / `F`) |
| `categorie` | `utilisateur_categorie?` | — | Catégorie (EC, BIATSS…) |
| `email_institutionnel` | `String?` | — | Email @univ |
| `telephone` | `String?` | — | Téléphone |
| `bureau` | `String?` | — | Bureau/localisation |
| `statut` | `utilisateur_statut` | Défaut : `ACTIF` | Actif ou inactif |

---

#### `annee_universitaire` — Années universitaires

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id_annee` | `BigInt` | PK | Identifiant |
| `libelle` | `String` | — | Ex : "2024-2025" |
| `date_debut` | `DateTime` | — | Début d'année |
| `date_fin` | `DateTime` | — | Fin d'année |
| `statut` | `annee_statut` | — | `EN_COURS`, `PREPARATION` ou `ARCHIVEE` |
| `id_annee_source` | `BigInt?` | FK → `annee_universitaire` | Année clonée depuis |

---

#### `entite_structure` — Structures organisationnelles

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id_entite` | `BigInt` | PK | Identifiant |
| `id_annee` | `BigInt` | FK → `annee_universitaire` | Année associée |
| `id_entite_parent` | `BigInt?` | FK → `entite_structure` | Parent hiérarchique |
| `type_entite` | `entite_type` | — | Type de structure |
| `nom` | `String` | — | Nom de l'entité |
| `tel_service` | `String?` | — | Téléphone du service |
| `bureau_service` | `String?` | — | Localisation |

**Sous-tables liées :**

| Table | Clé | Champs spécifiques |
|---|---|---|
| `composante` | `id_entite` (FK) | `code_composante`, `type_composante`, `site_web`, `mail_fonctionnel`, `campus` |
| `departement` | `id_entite` (FK) | `code_interne` |
| `mention` | `id_entite` (FK) | `type_diplome`, `cycle`, `id_type_diplome` |
| `parcours` | `id_entite` (FK) | `code_parcours` |
| `niveau` | `id_entite` (FK) | `libelle_court` |

---

#### `role` — Rôles

| Colonne | Type | Description |
|---|---|---|
| `id_role` | `BigInt` | PK |
| `libelle` | `String` | Identifiant textuel du rôle |
| `description` | `String?` | Description lisible |
| `niveau_hierarchique` | `Int` | Ordre hiérarchique (1 = plus haut) |
| `is_global` | `Boolean` | Rôle transverse à toutes les composantes |
| `est_administratif` | `Boolean` | Rôle administratif |
| `est_transverse` | `Boolean` | Rôle transverse |
| `id_composante` | `BigInt?` | FK → composante (rôle limité à une composante) |

---

#### `affectation` — Affectations (utilisateur ↔ rôle ↔ entité)

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id_affectation` | `BigInt` | PK | Identifiant |
| `id_user` | `BigInt` | FK → `utilisateur` | Utilisateur affecté |
| `id_role` | `BigInt` | FK → `role` | Rôle attribué |
| `id_entite` | `BigInt` | FK → `entite_structure` | Entité concernée |
| `id_annee` | `BigInt` | FK → `annee_universitaire` | Année universitaire |
| `date_debut` | `DateTime` | — | Début de l'affectation |
| `date_fin` | `DateTime?` | — | Fin de l'affectation |
| `id_affectation_n_plus_1` | `BigInt?` | FK → `affectation` | Supérieur hiérarchique |

**Contrainte unique :** `(id_user, id_role, id_entite, id_annee)`

---

#### `contact_role` — Contact lié à une affectation

| Colonne | Type | Description |
|---|---|---|
| `id_contact_role` | `BigInt` | PK |
| `id_affectation` | `BigInt` | FK → `affectation` (unique) |
| `email_fonctionnelle` | `String?` | Email de fonction |
| `telephone` | `String?` | Téléphone de contact |
| `bureau` | `String?` | Bureau |

---

#### `delegation` — Délégations de droits

| Colonne | Type | Description |
|---|---|---|
| `id_delegation` | `BigInt` | PK |
| `delegant_id` | `BigInt` | FK → `utilisateur` |
| `delegataire_id` | `BigInt` | FK → `utilisateur` |
| `id_entite` | `BigInt` | FK → `entite_structure` |
| `id_role` | `BigInt` | FK → `role` |
| `type_droit` | `String` | Type de droit délégué |
| `date_debut` | `DateTime` | Début de délégation |
| `date_fin` | `DateTime` | Fin de délégation |
| `statut` | `delegation_statut` | `ACTIVE`, `EXPIREE`, `ANNULEE` |

---

#### `signalement` — Signalements d'erreurs

| Colonne | Type | Description |
|---|---|---|
| `id_signalement` | `BigInt` | PK |
| `auteur_id` | `BigInt` | FK → `utilisateur` |
| `traitant_id` | `BigInt?` | FK → `utilisateur` |
| `cloture_par_id` | `BigInt?` | FK → `utilisateur` |
| `id_entite_cible` | `BigInt?` | Entité concernée |
| `id_user_cible` | `BigInt?` | Utilisateur concerné |
| `description` | `String` | Description du problème |
| `type_signalement` | `String` | Type d'erreur |
| `escalade_sc` | `Boolean` | Escaladé aux services centraux |
| `statut` | `signalement_statut` | `OUVERT`, `EN_COURS`, `CLOTURE` |
| `commentaires` | `String?` | Commentaires de traitement |
| `created_at` | `DateTime` | Date de création |
| `updated_at` | `DateTime` | Date de mise à jour |

---

#### `notification` — Notifications utilisateurs

| Colonne | Type | Description |
|---|---|---|
| `id_notif` | `BigInt` | PK |
| `destinataire_id` | `BigInt` | FK → `utilisateur` |
| `message` | `String` | Contenu de la notification |
| `date_envoi` | `DateTime` | Date d'envoi |
| `lu` | `Boolean` | Lue ou non |
| `id_demande` | `BigInt?` | Lien vers une demande |
| `id_signalement` | `BigInt?` | Lien vers un signalement |
| `id_demande_role` | `BigInt?` | Lien vers une demande de rôle |

---

#### `journal_audit` — Journal d'audit

| Colonne | Type | Description |
|---|---|---|
| `id_log` | `BigInt` | PK |
| `id_user_auteur` | `BigInt` | FK → `utilisateur` |
| `horodatage` | `DateTime` | Timestamp de l'action |
| `type_action` | `String` | `CREATE`, `UPDATE`, `DELETE`… |
| `cible_type` | `String` | Type d'entité modifiée |
| `cible_id` | `String` | ID de l'entité modifiée |
| `ancienne_valeur` | `Json?` | Valeur avant modification |
| `nouvelle_valeur` | `Json?` | Valeur après modification |

---

#### `organigramme` — Organigrammes

| Colonne | Type | Description |
|---|---|---|
| `id_organigramme` | `BigInt` | PK |
| `id_annee` | `BigInt` | FK → `annee_universitaire` |
| `id_entite_racine` | `BigInt` | Entité racine de l'arbre |
| `generated_by` | `BigInt` | FK → `utilisateur` |
| `generated_at` | `DateTime` | Date de génération |
| `est_fige` | `Boolean` | Organigramme figé (non modifiable) |
| `export_path` | `String?` | Chemin du fichier exporté |
| `export_format` | `String?` | Format d'export |
| `visibility_scope` | `String?` | Portée de visibilité |

---

#### `type_diplome` — Types de diplômes (référentiel)

| Colonne | Type | Description |
|---|---|---|
| `id_type_diplome` | `BigInt` | PK |
| `libelle` | `String` | Unique — ex : "Licence", "Master" |
| `is_active` | `Boolean` | Actif dans le référentiel |

39 types pré-chargés (Licence, Master, DUT, BTS, Doctorat, etc.)

---

## Gestion des migrations Prisma

### Créer une nouvelle migration

```bash
# Via Docker
docker compose run --rm migrate --name nom_de_la_migration

# En local
cd backend-nest
npx prisma migrate dev --name nom_de_la_migration
```

### Appliquer les migrations en production

```bash
# Via Docker
docker compose exec backend-nest npm run migrate:deploy

# En local
cd backend-nest
npm run migrate:deploy
# ou
npx prisma migrate deploy
```

### Voir l'état des migrations

```bash
docker compose exec backend-nest npx prisma migrate status
```

---

## Seed de données

### Seed initial (types diplômes, rôles)

```bash
# Via Docker
docker compose exec backend-nest npm run seed

# En local
cd backend-nest
npm run seed
```

### Seed depuis les fichiers CSV

```bash
# Étape 1 : générer les fichiers SQL depuis les CSV
python script/seed_annuaire.py

# Étape 2a : recharger via Docker (redémarre la DB avec init scripts)
docker compose down -v
docker compose up -d db

# Étape 2b : appliquer manuellement
docker compose exec db psql -U postgres -d CGP -f /docker-entrypoint-initdb.d/999_annuaire_seed.sql
```

### Fichiers CSV source

Placés dans `db-file-csv/` :

| Fichier | Contenu |
|---|---|
| `Composantes.csv` | Liste des composantes (UFR, IUT, Instituts) |
| `TypesDiplomes.csv` | Référentiel des types de diplômes |
| `903-IG.csv` | Données spécifiques à la composante IG |
| `925-IUTB.csv` | Données spécifiques à l'IUT B |
| `Feuil1.csv` | Données complémentaires |

---

## Commandes de maintenance

### Réinitialisation complète de la base

> **Attention** : cette commande supprime toutes les données.

```bash
# Via Docker
docker compose exec backend-nest npm run db:reset

# Équivalent à :
npx prisma migrate reset --force
```

### Reset + re-seed complet

```bash
docker compose exec backend-nest npm run db:fresh
```

### Sauvegarde de la base

```bash
# Dump PostgreSQL depuis le conteneur Docker
docker compose exec db pg_dump -U postgres CGP > backup_$(date +%Y%m%d).sql

# Restauration
docker compose exec -T db psql -U postgres CGP < backup_20241115.sql
```

### Accéder à la base depuis psql

```bash
# Via Docker
docker compose exec db psql -U postgres -d CGP

# En local
psql -U postgres -d CGP -h localhost -p 5432
```

### Accéder au Studio Prisma (interface visuelle)

```bash
cd backend-nest
npx prisma studio
# Ouvre http://localhost:5555
```

---

## Conventions de codage Prisma

### Patterns utilisés dans ce projet

| Pattern | Description |
|---|---|
| **IDs BigInt** | Tous les identifiants primaires sont `BigInt` avec `@default(autoincrement())` |
| **Suppression douce** | Les entités ne sont jamais supprimées physiquement — le champ `statut` passe à `INACTIF` |
| **Hiérarchie** | Les entités référencent leur parent via `id_entite_parent` (auto-référence) |
| **Audit automatique** | L'`AuditInterceptor` global enregistre automatiquement toutes les mutations dans `journal_audit` |
| **Relations nommées** | Les relations entre entités utilisent des noms explicites pour éviter les ambiguïtés Prisma |

### Conventions de nommage

- **Tables** : `snake_case` (ex : `annee_universitaire`)
- **Colonnes** : `snake_case` (ex : `date_debut`)
- **Enums** : `snake_case` pour le nom, `SCREAMING_SNAKE_CASE` pour les valeurs
- **Relations Prisma** : `camelCase` dans le schéma

---

## Surveillance et santé

### Vérifier la connexion à la base

```bash
# Health check de l'API (vérifie aussi la DB)
curl http://localhost:3001/api/health

# Réponse attendue :
# { "status": "ok", "db": "connected" }
```

### Vérifier l'espace disque

```bash
# Taille du volume Docker
docker system df -v | grep db-data

# Taille de la base depuis psql
SELECT pg_size_pretty(pg_database_size('CGP'));
```

### Logs de la base de données

```bash
docker compose logs db
docker compose logs -f db    # mode suivi en temps réel
```

---

## Évolution du schéma — Procédure recommandée

1. **Modifier** `backend-nest/prisma/schema.prisma`
2. **Créer la migration** :
   ```bash
   docker compose run --rm migrate --name description_du_changement
   ```
3. **Vérifier** le fichier SQL généré dans `prisma/migrations/`
4. **Tester** la migration sur un environnement de recette
5. **Déployer** en production :
   ```bash
   docker compose exec backend-nest npm run migrate:deploy
   ```
6. **Mettre à jour** la documentation si le schéma change significativement
