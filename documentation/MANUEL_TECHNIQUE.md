# Manuel Technique

Etat du manuel: avril 2026.

## 1. Objet du projet

CGP est un annuaire de formation universitaire avec gouvernance par roles, structures et annees universitaires.

Le produit couvre notamment:

- la recherche avancee de responsables, formations, structures et secretariats
- la gestion des utilisateurs, affectations et contacts fonctionnels
- la gestion des delegations, demandes de roles, signalements et notifications
- la gestion des fiches structures
- la generation et l'export d'organigrammes
- la gestion du cycle de vie des annees universitaires
- l'import et l'export metier via workbook standardise

## 2. Stack technique

### Backend

- Node.js 22 en conteneur
- NestJS 11
- Prisma 7
- PostgreSQL 16

### Frontend

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- `lucide-react` pour les icones

### Orchestration locale

- Docker Compose
- services permanents:
  `db`, `backend-nest`, `frontend`
- service outil optionnel:
  `migrate`

## 3. Architecture globale

Flux principal:

1. le navigateur charge l'application React sur `frontend`
2. le frontend appelle l'API via `/api`
3. le backend applique les gardes d'authentification, de role, de portee structurelle et d'annee
4. Prisma interagit avec PostgreSQL
5. certains flux lisent ou ecrivent des fichiers metier via `files/`

Structure du depot:

```text
.
|-- backend-nest/
|   |-- prisma/
|   |-- src/
|   `-- test/
|-- frontend/
|   `-- src/
|-- documentation/
|-- files/
|-- script/
`-- docker-compose.yml
```

## 4. Authentification et controle d'acces

### 4.1 Authentification

En developpement, le projet fonctionne par defaut avec `AUTH_MODE=mock`.

Mecanisme:

- le frontend stocke le login dans `localStorage`
- chaque appel API ajoute `x-user-login`
- le backend reconstruit l'utilisateur courant a partir de la base et de ses affectations

### 4.2 Roles applicatifs

Les roles de reference sont definis:

- cote backend dans `backend-nest/src/auth/roles.constants.ts`
- cote frontend dans `frontend/src/types.ts`

Roles structurants:

- `services-centraux`
- `administrateur`
- roles de direction:
  composante, administratif, departement, mention, specialite, formation, annee
- `secretariat-pedagogique`
- `utilisateur-simple`
- `lecture-seule`

### 4.3 Gardes backend

Le backend applique principalement:

- `MockAuthGuard`
  hydratation de `request.user`
- `RolesGuard`
  verification des roles declares sur les routes
- `ScopeGuard`
  verification du perimetre structurel
- `YearGuard`
  verification du perimetre d'annee
- `ThrottleGuard`
  garde anti-abus de base

### 4.4 Regles d'acces importantes

- le changement d'annee dans l'interface est reserve aux services centraux
- la recherche sans `yearId` est reservee aux profils globaux (`services-centraux`, `administrateur`)
- l'edition des fiches structures est reservee aux services centraux
- la creation de delegation reste reservee a certains roles de direction

## 5. Modele de donnees

Noyau metier principal:

- `annee_universitaire`
- `entite_structure`
- `utilisateur`
- `role`
- `affectation`
- `contact_role`
- `delegation`
- `organigramme`
- `signalement`
- `notification`
- `demande_role`
- `journal_audit`

### 5.1 Hierarchie des structures

Les types structurants sont:

- `COMPOSANTE`
- `DEPARTEMENT`
- `MENTION`
- `PARCOURS`
- `NIVEAU`

La hierarchie est portee par `entite_structure.id_entite_parent`.

Tables specialisees associees:

- `composante`
- `departement`
- `mention`
- `parcours`
- `niveau`

### 5.2 Particularites metier

- une affectation est unique sur `(id_user, id_role, id_entite, id_annee)`
- la hierarchie des personnes repose sur `id_affectation_n_plus_1`
- `contact_role` porte les coordonnees fonctionnelles de l'affectation
- certaines operations de suppression doivent respecter un ordre strict a cause des dependances metier

## 6. Modules backend

| Module | Role principal |
| --- | --- |
| `auth` | hydratation de l'utilisateur courant |
| `users` | listing, detail, creation, mise a jour, suppression d'utilisateurs |
| `roles` | referentiel des roles et demandes de roles |
| `entites` | liste, detail et edition des structures |
| `affectations` | creation, edition, suppression d'affectations et contacts |
| `search` | recherche annuaire multi-onglets |
| `delegations` | liste, creation, export CSV, revocation |
| `organigrammes` | generation, lecture, gel, export |
| `annees` | creation, clonage, activation, archivage, suppression |
| `imports` | preview et import du workbook standardise |
| `exports` | exports metier et workbook |
| `dashboard` | statistiques de synthese |
| `demandes` | signalements et traitement |
| `notifications` | lecture et marquage des notifications |
| `audit` | consultation et export du journal d'audit |

## 7. Frontend

### 7.1 Orchestration

`frontend/src/App.tsx` pilote:

- la connexion locale
- le chargement du profil courant
- le contexte d'annee
- la navigation par ecrans
- le passage des props de role, annee et perimetre aux composants metier

### 7.2 Ecrans principaux

| Ecran | Fichier | Remarque |
| --- | --- | --- |
| Tableau de bord | `Dashboard.tsx` | synthese |
| Recherche | `DirectorySearch.tsx` | recherche multi-onglets, perimetre annee ou base complete pour profils globaux |
| Responsables | `ManageResponsibles.tsx` | personnes, affectations, edition des coordonnees et des contacts |
| Fiches structures | `ManageStructures.tsx` | detail structure et edition par type |
| Demandes de roles | `ManageRoles.tsx` | creation et revue |
| Delegations | `Delegations.tsx` | creation, filtres dynamiques, revocation, export |
| Organigramme | `OrgChart.tsx` | generation, lecture, filtres et exports |
| Import / Export | `ImportExport.tsx` | workflow workbook standardise |
| Annees | `YearManagement.tsx` | creation, clonage, activation, archivage |
| Signalements | `ErrorReports.tsx` | creation et traitement |
| Audit | `AuditLogs.tsx` | consultation des traces |
| Profil | `UserProfile.tsx` | fiche utilisateur |

### 7.3 Utilitaires frontend

- `lib/api.ts`
  wrapper `fetch`, ajout automatique du header `x-user-login`
- `lib/entite-hierarchy.ts`
  logique partagee de filtres hierarchiques dynamiques
- `lib/url-state.ts`
  gestion des parametres d'URL sur certains ecrans

Note:

- `DirectorySearch` et `Delegations` nettoient explicitement les anciens parametres `ds_*` et `dg_*`
- l'objectif est d'eviter de laisser des etats sensibles dans l'URL sur ces ecrans

## 8. Flux metier sensibles

### 8.1 Recherche avancee

Le module `search` supporte quatre onglets:

- responsables
- formations
- structures
- secretariats

Points techniques notables:

- le frontend recharge dynamiquement la liste des structures de filtre quand le perimetre change
- `yearId` est optionnel cote backend, mais son absence est interdite aux profils non globaux
- la recherche hierarchique s'appuie sur `entiteIds`, calcule cote frontend a partir du filtre selectionne
- le frontend parse correctement la reponse `/roles` sous forme `{ items }`

### 8.2 Gestion des responsables

Le module `ManageResponsibles` permet maintenant:

- l'edition des champs personne:
  `nom`, `prenom`, `email_institutionnel`, `email_institutionnel_secondaire`, `genre`, `categorie`, `telephone`, `bureau`
- l'ajout et la suppression d'affectations
- l'edition d'une affectation existante:
  role, structure, dates, email fonctionnel, telephone fonctionnel, bureau fonctionnel

### 8.3 Fiches structures

Le module `ManageStructures` expose un detail complet par type et un modal d'edition reserve aux services centraux.

Champs couverts selon le type:

- composante:
  `code_composante`, `type_composante`, `mail_fonctionnel`, `mail_institutionnel`, `campus`, `site_web`
- departement:
  `code_interne`
- mention:
  `type_diplome`, `cycle`
- parcours:
  `code_parcours`
- niveau:
  `libelle_court`

### 8.4 Delegations

Le module `Delegations` a deux comportements a distinguer:

- la consultation peut rester bornee au perimetre structurel visible de l'utilisateur
- la creation est plus stricte:
  pour les profils non centraux, seule une structure d'affectation directe peut etre choisie

Le formulaire de creation propose:

- des filtres hierarchiques dynamiques
- une liste de structures deja filtree par perimetre autorise
- les droits suivants:
  `view`, `manage_responsables`, `assign_role`, `validate_signalement`, `generate_orgchart`, `import_data`, `full`

### 8.5 Annees universitaires

Le module `annees` permet:

- la creation d'une annee vide
- le clonage complet ou selectif
- la copie optionnelle des affectations
- l'activation ou l'archivage
- la suppression avec sauvegarde workbook prealable

### 8.6 Import / export standardise

Le format standardise du projet est `CGP_STANDARD_V1`.

Le backend gere:

- export d'une annee complete
- export d'une structure et de son sous-arbre
- generation d'un modele vide
- preview d'import
- import complet ou cible sur une structure source

## 9. Docker et exploitation

Le mode de travail recommande est Docker-first.

Implications pratiques:

- ne pas documenter de workflow quotidien base sur `npm` local hote
- lancer la stack avec `docker compose up -d --build`
- lancer les builds et tests avec `docker compose exec ...`

Le backend demarre via `npm run start:docker`, qui execute:

1. `prisma generate`
2. `npm run docker:init`
3. `nest start --watch`

## 10. Conventions importantes

### 10.1 Convention d'API

Les routes renvoient le plus souvent des enveloppes:

- `{ items }`
- `{ item }`
- `{ user }`
- `{ affectation }`
- `{ delegation }`

Le frontend depend de ces envelopes. Tout changement de forme doit etre synchronise des deux cotes.

### 10.2 Dist frontend

Le dossier `frontend/dist/` est regenere lors des builds Docker du frontend.

### 10.3 Vigilance actuelle

- la couverture de tests automatisee reste partielle
- le frontend repose surtout sur le build et la recette manuelle
- toute evolution de garde ou de role doit etre reverifiee a la fois cote UI et cote API

## 11. Faire evoluer proprement le projet

### Ajouter un endpoint backend

1. creer le service et le controleur
2. proteger la route avec `@Roles` si necessaire
3. verifier l'impact `ScopeGuard` et `YearGuard`
4. synchroniser le contrat dans `API_BACKEND.md`

### Ajouter ou modifier un ecran frontend

1. creer ou adapter le composant dans `frontend/src/components/`
2. brancher l'ecran dans `App.tsx`
3. verifier les droits d'acces UI
4. verifier le contrat API reel
5. mettre a jour la documentation utilisateur et la recette

### Faire evoluer le workbook standardise

1. modifier les colonnes et le parser cote backend
2. synchroniser le parser cote frontend
3. verifier la compatibilite ascendante
4. documenter les changements
