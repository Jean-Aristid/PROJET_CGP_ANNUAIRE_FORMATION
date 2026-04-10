# Documentation API — CGP Annuaire Formation

## Informations générales

- **Base URL** : `http://localhost:3001/api`
- **Format** : JSON
- **Authentification** : Header `x-user-login: <login>` (mode mock)
- **Content-Type** : `application/json`

### Format des réponses

```json
{
  "item":  { },        // objet unique
  "items": [ ],        // liste d'objets
  "user":  { },        // utilisateur courant (certaines routes)
  "csv":   "...",      // données CSV (exports)
  "status": "..."      // statut de l'opération
}
```

### Rôles disponibles

| Identifiant | Libellé |
|---|---|
| `SERVICES_CENTRAUX` | Services centraux (administration générale) |
| `DIRECTEUR_COMPOSANTE` | Directeur de composante |
| `DIRECTEUR_ADMINISTRATIF` | Directeur administratif |
| `RESPONSABLE_MENTION` | Responsable de mention |
| `RESPONSABLE_PARCOURS` | Responsable de parcours |
| `SECRETARIAT_PEDAGOGIQUE` | Secrétariat pédagogique |

---

## Health

### `GET /health`

Vérifie la disponibilité de l'API et la connexion à la base de données.

**Authentification** : non requise

**Réponse 200 :**
```json
{ "status": "ok", "db": "connected" }
```

---

## Authentification — `/auth`

### `GET /auth/me`

Retourne l'utilisateur actuellement authentifié.

**Réponse 200 :**
```json
{
  "user": {
    "id_user": 1,
    "login": "jdupont",
    "nom": "Dupont",
    "prenom": "Jean",
    "email_institutionnel": "jean.dupont@univ.fr",
    "statut": "ACTIF",
    "affectations": [ ]
  }
}
```

---

## Utilisateurs — `/users`

### `GET /users`

Liste les utilisateurs avec pagination. Le résultat est filtré selon le rôle de l'appelant.

**Paramètres de requête :**
| Paramètre | Type | Description |
|---|---|---|
| `page` | number | Numéro de page (défaut : 1) |
| `limit` | number | Taille de page (défaut : 20) |
| `search` | string | Recherche par nom/prénom/login |

**Réponse 200 :**
```json
{ "items": [ { "id_user": 1, "login": "jdupont", "nom": "Dupont", ... } ], "total": 42 }
```

### `GET /users/:id`

Retourne le détail d'un utilisateur.

**Réponse 200 :**
```json
{ "item": { "id_user": 1, "login": "jdupont", ... } }
```

**Erreurs :** `404` utilisateur non trouvé

### `POST /users`

Crée un nouvel utilisateur.

**Rôles requis :** `SERVICES_CENTRAUX`, `DIRECTEUR_COMPOSANTE`

**Corps :**
```json
{
  "login": "mnguyen",
  "nom": "Nguyen",
  "prenom": "Marie",
  "email_institutionnel": "marie.nguyen@univ.fr",
  "categorie": "EC",
  "genre": "F"
}
```

**Réponse 201 :** utilisateur créé

### `PATCH /users/:id`

Met à jour un utilisateur (soi-même ou un utilisateur géré).

**Corps :** champs partiels de l'utilisateur

**Réponse 200 :** utilisateur mis à jour

### `DELETE /users/:id`

Désactive un utilisateur (suppression douce : statut → `INACTIF`).

**Rôles requis :** `SERVICES_CENTRAUX`, `DIRECTEUR_COMPOSANTE`

**Réponse 200 :** `{ "status": "deleted" }`

---

## Affectations — `/affectations`

Une affectation associe un utilisateur à un rôle dans une entité pour une année universitaire.

### `POST /affectations`

Crée une affectation.

**Rôles requis :** `DIRECTEUR_COMPOSANTE`, `DIRECTEUR_ADMINISTRATIF`, `SERVICES_CENTRAUX`

**Corps :**
```json
{
  "id_user": 1,
  "id_role": 3,
  "id_entite": 10,
  "id_annee": 2,
  "date_debut": "2024-09-01",
  "date_fin": "2025-08-31"
}
```

**Contraintes :** `date_fin >= date_debut`

**Réponse 201 :** affectation créée

### `GET /affectations/:id`

Retourne une affectation par son identifiant.

**Réponse 200 :**
```json
{ "item": { "id_affectation": 1, "id_user": 1, "id_role": 3, ... } }
```

### `PATCH /affectations/:id`

Met à jour une affectation existante.

**Corps :** champs partiels (dates, rôle, entité)

**Réponse 200 :** affectation mise à jour

### `PATCH /affectations/:id/contact`

Crée ou met à jour les informations de contact liées à une affectation.

**Corps :**
```json
{
  "email_fonctionnelle": "contact@composante.fr",
  "telephone": "05 61 00 00 00",
  "bureau": "Bâtiment A — Bureau 201"
}
```

**Réponse 200 :** contact mis à jour

### `DELETE /affectations/:id`

Supprime une affectation.

**Réponse 200 :** `{ "status": "deleted" }`

---

## Années universitaires — `/years`

### `GET /years`

Liste les années universitaires accessibles à l'utilisateur courant.

**Réponse 200 :**
```json
{ "items": [ { "id_annee": 1, "libelle": "2024-2025", "statut": "EN_COURS" } ] }
```

### `GET /years/:id`

Retourne le détail d'une année universitaire.

### `POST /years/:id/clone`

Clone une année universitaire existante vers une nouvelle.

**Rôles requis :** `SERVICES_CENTRAUX`

**Réponse 201 :** nouvelle année créée

### `PATCH /years/:id/status`

Met à jour le statut d'une année (`EN_COURS`, `PREPARATION`, `ARCHIVEE`).

**Rôles requis :** `SERVICES_CENTRAUX`

**Corps :**
```json
{ "statut": "ARCHIVEE" }
```

### `DELETE /years/:id`

Supprime une année universitaire.

**Rôles requis :** `SERVICES_CENTRAUX`

---

## Entités / Structures — `/entites`

Les entités regroupent les composantes, départements, mentions, parcours et niveaux.

### `GET /entites`

Liste les entités pour l'année courante.

**Paramètres de requête :**
| Paramètre | Type | Description |
|---|---|---|
| `type` | string | Filtre par type (`COMPOSANTE`, `MENTION`, etc.) |
| `id_annee` | number | Année universitaire |

**Réponse 200 :**
```json
{ "items": [ { "id_entite": 1, "nom": "UFR Sciences", "type_entite": "COMPOSANTE" } ] }
```

### `GET /entites/:id`

Retourne le détail d'une entité (avec sous-entités et affectations).

### `PATCH /entites/:id`

Met à jour une entité (nom, contact, informations spécifiques).

**Rôles requis :** `SERVICES_CENTRAUX`

---

## Recherche — `/search`

### `GET /search/responsables`

Recherche des responsables dans l'annuaire.

**Paramètres de requête :**
| Paramètre | Type | Description |
|---|---|---|
| `q` | string | Terme de recherche |
| `id_composante` | number | Filtre par composante |
| `id_annee` | number | Année universitaire |

**Réponse 200 :**
```json
{
  "items": [
    {
      "nom": "Dupont",
      "prenom": "Jean",
      "role": "Responsable de mention",
      "entite": "Mention Informatique",
      "email": "jean.dupont@univ.fr"
    }
  ]
}
```

### `GET /search/formations`

Recherche des formations (mentions et parcours).

**Paramètres de requête :** `q`, `id_composante`, `id_annee`, `type_diplome`

### `GET /search/structures`

Recherche dans les structures organisationnelles.

### `GET /search/secretariats`

Recherche dans les secrétariats pédagogiques.

---

## Délégations — `/delegations`

Une délégation permet à un responsable de confier temporairement ses droits à un autre utilisateur.

### `GET /delegations`

Liste les délégations de l'utilisateur courant (délégant ou délégataire, selon le rôle).

**Réponse 200 :**
```json
{
  "items": [
    {
      "id_delegation": 1,
      "delegant": { "nom": "Martin", "prenom": "Paul" },
      "delegataire": { "nom": "Leroy", "prenom": "Sophie" },
      "type_droit": "LECTURE",
      "date_debut": "2024-11-01",
      "date_fin": "2024-11-30",
      "statut": "ACTIVE"
    }
  ]
}
```

### `POST /delegations`

Crée une délégation.

**Rôles requis :** `DIRECTEUR_COMPOSANTE`, `DIRECTEUR_ADMINISTRATIF`, `RESPONSABLE_MENTION`, `RESPONSABLE_PARCOURS`

**Corps :**
```json
{
  "delegataire_id": 5,
  "id_entite": 10,
  "id_role": 3,
  "type_droit": "LECTURE",
  "date_debut": "2024-11-01",
  "date_fin": "2024-11-30"
}
```

**Contrainte :** le délégant doit avoir une affectation sur l'entité concernée. Exception : `SERVICES_CENTRAUX` peut déléguer sans restriction.

**Réponse 201 :** délégation créée

### `GET /delegations/export`

Exporte les délégations au format CSV.

**Rôles requis :** `SERVICES_CENTRAUX`

**Réponse 200 :** fichier CSV

### `PATCH /delegations/:id/revoke`

Révoque une délégation (statut → `ANNULEE`).

**Autorisé à :** le délégant lui-même ou `SERVICES_CENTRAUX`

---

## Signalements — `/signalements`

Les signalements permettent de remonter des erreurs ou incohérences dans l'annuaire.

### `GET /signalements`

Liste les signalements accessibles à l'utilisateur courant.

**Réponse 200 :**
```json
{
  "items": [
    {
      "id_signalement": 1,
      "description": "Mauvais responsable de mention",
      "statut": "OUVERT",
      "type_signalement": "ERREUR_RESPONSABLE",
      "escalade_sc": false
    }
  ]
}
```

### `POST /signalements`

Crée un nouveau signalement.

**Corps :**
```json
{
  "description": "Le responsable affiché est incorrect",
  "type_signalement": "ERREUR_RESPONSABLE",
  "id_entite_cible": 10,
  "id_user_cible": 3
}
```

**Réponse 201 :** signalement créé

### `PATCH /signalements/:id`

Met à jour le statut d'un signalement (`OUVERT`, `EN_COURS`, `CLOTURE`).

**Corps :**
```json
{ "statut": "EN_COURS", "commentaires": "Pris en charge par le directeur" }
```

### `PATCH /signalements/:id/escalade`

Escalade un signalement vers les services centraux.

**Réponse 200 :** signalement mis à jour avec `escalade_sc: true`

---

## Rôles — `/roles`

### `GET /roles`

Liste tous les rôles disponibles, triés par niveau hiérarchique croissant.

**Réponse 200 :**
```json
{ "items": [ { "idRole": 1, "libelle": "SERVICES_CENTRAUX", "niveauHierarchique": 1 } ] }
```

### `GET /roles/requests`

Liste les demandes de rôle accessibles à l'utilisateur (superviseurs uniquement).

### `POST /roles/requests`

Crée une demande de rôle.

**Corps :**
```json
{
  "role_propose": "RESPONSABLE_MENTION",
  "description": "Je souhaite accéder à la gestion de la mention Informatique",
  "justificatif": "Lettre signée du directeur de composante"
}
```

### `PATCH /roles/requests/:id`

Valide ou refuse une demande de rôle.

**Rôles requis :** `SERVICES_CENTRAUX`

**Corps :**
```json
{ "statut": "VALIDEE" }
```

---

## Organigrammes — `/organigrammes`

### `GET /organigrammes`

Liste les organigrammes disponibles pour l'utilisateur courant.

### `GET /organigrammes/latest`

Retourne le dernier organigramme généré avec sa structure arborescente.

**Réponse 200 :**
```json
{
  "item": {
    "id_organigramme": 1,
    "generated_at": "2024-11-15T10:30:00Z",
    "est_fige": false,
    "tree": { "nom": "Université", "enfants": [ ] }
  }
}
```

### `POST /organigrammes/generate`

Génère un nouvel organigramme pour l'année courante.

**Rôles requis :** `DIRECTEUR_COMPOSANTE`, `DIRECTEUR_ADMINISTRATIF`, `SERVICES_CENTRAUX`

### `GET /organigrammes/:id/tree`

Retourne l'arborescence complète d'un organigramme.

### `PATCH /organigrammes/:id/freeze`

Gèle ou dégèle un organigramme (empêche les modifications).

**Rôles requis :** `SERVICES_CENTRAUX`

**Corps :** `{ "est_fige": true }`

### `GET /organigrammes/:id/export`

Exporte l'organigramme (PDF ou autre format).

---

## Exports — `/exports`

### `GET /exports/responsables`

Exporte la liste complète des responsables au format CSV.

**Rôles requis :** `SERVICES_CENTRAUX`

**Réponse 200 :** fichier CSV avec en-têtes : `nom, prenom, role, entite, email, telephone, bureau`

### `GET /exports/workbook`

Exporte le classeur standard (format Excel compatible).

**Rôles requis :** `SERVICES_CENTRAUX`

**Réponse 200 :** fichier `.xlsx`

---

## Imports — `/imports`

Les imports se font en deux phases : prévisualisation puis confirmation.

### `POST /imports/responsables/preview`

Prévisualise un import de responsables (fichier CSV).

**Corps :** `multipart/form-data` avec le fichier CSV

**Réponse 200 :**
```json
{
  "preview": [ { "nom": "Dupont", "role": "Responsable Mention", "action": "CREATE" } ],
  "errors": [ ]
}
```

### `POST /imports/responsables/confirm`

Confirme et applique l'import prévisualisé.

**Réponse 200 :** `{ "imported": 42, "errors": 0 }`

### `POST /imports/workbook/preview`

Prévisualise un import depuis le classeur standard.

**Rôles requis :** `SERVICES_CENTRAUX`

### `POST /imports/workbook/confirm`

Confirme l'import du classeur standard.

**Rôles requis :** `SERVICES_CENTRAUX`

---

## Notifications — `/notifications`

### `GET /notifications`

Retourne les notifications de l'utilisateur courant (paginées).

**Paramètres de requête :**
| Paramètre | Type | Description |
|---|---|---|
| `page` | number | Numéro de page |
| `unread_only` | boolean | Seulement les non lues |

**Réponse 200 :**
```json
{
  "items": [ { "id_notif": 1, "message": "Votre demande a été validée", "lu": false } ],
  "unread_count": 3
}
```

### `PATCH /notifications/:id/read`

Marque une notification comme lue.

**Réponse 200 :** `{ "status": "read" }`

---

## Dashboard — `/dashboard`

### `GET /dashboard/stats`

Retourne les statistiques globales pour l'année courante.

**Paramètres de requête :** `id_annee`

**Réponse 200 :**
```json
{
  "item": {
    "nb_composantes": 8,
    "nb_mentions": 120,
    "nb_responsables": 350,
    "nb_signalements_ouverts": 5,
    "nb_delegations_actives": 12
  }
}
```

---

## Audit — `/audit`

**Rôles requis pour toutes les routes :** `SERVICES_CENTRAUX`

### `GET /audit`

Liste les entrées du journal d'audit avec filtres.

**Paramètres de requête :**
| Paramètre | Type | Description |
|---|---|---|
| `page` | number | Numéro de page |
| `type_action` | string | Filtre par type d'action |
| `date_debut` | string | Date de début (ISO 8601) |
| `date_fin` | string | Date de fin (ISO 8601) |

**Réponse 200 :**
```json
{
  "items": [
    {
      "id_log": 1,
      "type_action": "UPDATE",
      "cible_type": "utilisateur",
      "cible_id": "42",
      "horodatage": "2024-11-15T14:22:00Z",
      "auteur": { "nom": "Admin", "prenom": "Central" }
    }
  ]
}
```

### `GET /audit/export`

Exporte le journal d'audit au format CSV.

**Réponse 200 :** fichier CSV

---

## Codes d'erreur HTTP

| Code | Signification |
|---|---|
| `200` | Succès |
| `201` | Ressource créée |
| `400` | Données invalides (validation échouée) |
| `401` | Non authentifié |
| `403` | Accès refusé (rôle insuffisant) |
| `404` | Ressource non trouvée |
| `409` | Conflit (entrée dupliquée) |
| `500` | Erreur interne du serveur |
