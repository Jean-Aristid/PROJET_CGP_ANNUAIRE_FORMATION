# Reference API Backend

Etat de la reference: avril 2026.

## 1. Generalites

### Base URL

- via le frontend local: `/api`
- backend direct: `http://localhost:3001/api`

### Authentification en developpement

- header attendu: `x-user-login`
- le backend reconstruit l'utilisateur courant a partir du login

### Forme des reponses

Les routes renvoient principalement des envelopes JSON:

- `{ items }`
- `{ item }`
- `{ user }`
- `{ affectation }`
- `{ delegation }`
- `{ csv }`

### Controles d'acces

En plus de `@Roles`, une route peut etre refusee par:

- `ScopeGuard`
- `YearGuard`
- des verifications metier internes au service

## 2. Sante et session

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/health` | public technique | sante applicative |
| `GET` | `/auth/me` | utilisateur authentifie | profil courant hydrate |

## 3. Annees universitaires

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/years` | tous roles | liste des annees visibles |
| `GET` | `/years/:id` | tous roles | detail d'une annee visible |
| `POST` | `/years/:id/clone` | services centraux | creation par clonage ou creation vide |
| `PATCH` | `/years/:id/status` | services centraux | activation, preparation ou archivage |
| `DELETE` | `/years/:id` | services centraux | suppression avec sauvegarde metier |

Corps utiles pour `POST /years/:id/clone`:

- `libelle`
- `date_debut`
- `date_fin`
- `statut`
- `copy_affectations`
- `root_entite_ids` optionnel

## 4. Structures

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/entites` | tous roles | liste des structures, avec `yearId` optionnel |
| `GET` | `/entites/:id` | tous roles | detail structure, responsables, secretariat, statistiques |
| `PATCH` | `/entites/:id` | services centraux | mise a jour d'une structure |

### Parametres utiles

`GET /entites`

- `yearId` optionnel

### Champs pris en charge par `PATCH /entites/:id`

Communs:

- `nom`
- `tel_service`
- `bureau_service`

Selon le type:

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

## 5. Utilisateurs

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/users` | tous roles | liste paginee des utilisateurs visibles |
| `GET` | `/users/:id` | tous roles | detail d'un utilisateur visible |
| `POST` | `/users` | services centraux, DC, DA, DAA | creation d'un utilisateur |
| `PATCH` | `/users/:id` | large spectre selon le profil | mise a jour de fiche utilisateur |
| `DELETE` | `/users/:id` | services centraux, directeur composante | suppression |

### Parametres utiles

`GET /users`

- `yearId`
- `page`
- `pageSize`
- autres filtres selon `UsersListQueryDto`

### Champs pris en charge par `PATCH /users/:id`

- `nom`
- `prenom`
- `email_institutionnel`
- `email_institutionnel_secondaire`
- `genre`
- `categorie`
- `telephone`
- `bureau`

### Regles particulieres

- un utilisateur qui modifie sa propre fiche ne peut pas changer `nom`, `prenom` ou `email_institutionnel`
- la modification d'un autre utilisateur suppose un role de gestion adequat

## 6. Affectations et contacts

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `POST` | `/affectations` | services centraux, DC, DA, DAA | creation d'une affectation |
| `GET` | `/affectations/:id` | tous roles | detail d'une affectation |
| `PATCH` | `/affectations/:id` | services centraux, DC, DA, DAA | mise a jour d'une affectation |
| `PATCH` | `/affectations/:id/contact` | tous roles | creation ou mise a jour du contact fonctionnel |
| `DELETE` | `/affectations/:id` | services centraux, DC, DA, DAA | suppression d'une affectation |

### Champs pris en charge par `PATCH /affectations/:id`

- `id_role`
- `id_entite`
- `date_debut`
- `date_fin`
- `id_affectation_n_plus_1`

### Champs pris en charge par `PATCH /affectations/:id/contact`

- `email_fonctionnelle`
- `telephone`
- `bureau`

## 7. Roles et demandes de roles

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/roles` | tous roles | referentiel des roles |
| `GET` | `/roles/requests` | roles de direction + SC | liste des demandes |
| `POST` | `/roles/requests` | roles de direction | creation d'une demande |
| `PATCH` | `/roles/requests/:id` | services centraux | validation ou refus |

## 8. Recherche annuaire

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/search/responsables` | tous roles | recherche de responsables |
| `GET` | `/search/formations` | tous roles | recherche de formations |
| `GET` | `/search/structures` | tous roles | recherche de structures |
| `GET` | `/search/secretariats` | tous roles | recherche de secretariats |

### Parametres recurrents

Selon la route:

- `q`
- `yearId`
- `roleId`
- `typeEntite`
- `typeDiplome`
- `entiteIds`
- `page`
- `pageSize`

### Regle d'autorisation importante

L'absence de `yearId` declenche une recherche sur toute la base.

Ce mode est reserve aux profils globaux:

- `services-centraux`
- `administrateur`

Pour les autres profils, le backend refuse la recherche sans `yearId`.

## 9. Delegations

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/delegations` | utilisateur authentifie | liste des delegations visibles |
| `POST` | `/delegations` | DC, DA, DAA | creation d'une delegation |
| `GET` | `/delegations/export` | services centraux | export CSV |
| `PATCH` | `/delegations/:id/revoke` | delegant concerne ou services centraux | revocation |

### Corps utiles pour `POST /delegations`

- `delegataire_id`
- `id_entite`
- `id_role` optionnel
- `type_droit`
- `date_debut`
- `date_fin` optionnel

### Valeurs autorisees pour `type_droit`

- `view`
- `manage_responsables`
- `assign_role`
- `validate_signalement`
- `generate_orgchart`
- `import_data`
- `full`

### Regle metier importante

Pour un utilisateur non central, la creation d'une delegation exige une affectation sur l'entite cible elle-meme.

Autrement dit:

- avoir un role sur une structure parente ne suffit pas automatiquement
- la creation sur un descendant non affecte directement est refusee

## 10. Organigrammes

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/organigrammes` | tous roles | liste des organigrammes deja generes |
| `GET` | `/organigrammes/latest` | tous roles | dernier organigramme visible dans le perimetre |
| `POST` | `/organigrammes/generate` | roles de direction autorises | generation |
| `GET` | `/organigrammes/:id/tree` | tous roles | lecture d'un organigramme existant |
| `PATCH` | `/organigrammes/:id/freeze` | services centraux | gel / degel |
| `GET` | `/organigrammes/:id/export` | tous roles | export PDF, CSV, JSON ou SVG |

Parametres utiles:

- `yearId`
- `view`
- `q`
- `roleId`
- `entiteIds`
- `format`

## 11. Signalements

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/signalements` | utilisateur authentifie | liste visible |
| `POST` | `/signalements` | utilisateur authentifie | creation |
| `PATCH` | `/signalements/:id` | selon regles du service | traitement |
| `PATCH` | `/signalements/:id/escalade` | utilisateur authentifie | escalade |

## 12. Notifications

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/notifications` | tous roles | notifications du profil courant |
| `PATCH` | `/notifications/:id/read` | tous roles | marquage lu |

## 13. Tableau de bord

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/dashboard/stats` | tous roles | statistiques de synthese |

## 14. Audit

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/audit` | services centraux | consultation du journal |
| `GET` | `/audit/export` | services centraux | export CSV |

## 15. Imports et exports

### 15.1 Exports

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `GET` | `/exports/responsables` | services centraux | export herite responsables |
| `GET` | `/exports/workbook` | services centraux | export workbook standardise |

Parametres utiles:

- `yearId` obligatoire pour `/exports/workbook`
- `entiteId` optionnel
- `template=true` pour generer un modele vide

### 15.2 Imports herites

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `POST` | `/imports/responsables/preview` | SC, DC, DA, DAA | preview CSV responsables |
| `POST` | `/imports/responsables/confirm` | SC, DC, DA, DAA | confirmation selective |
| `POST` | `/imports/responsables` | SC, DC, DA, DAA | import direct CSV |

### 15.3 Imports workbook standardise

| Methode | Route | Acces | Usage |
| --- | --- | --- | --- |
| `POST` | `/imports/workbook/preview` | services centraux | simulation d'import |
| `POST` | `/imports/workbook/confirm` | services centraux | import reel |

Corps utiles:

- `workbook`
- `targetYearId`
- `createTargetYear`
- `scopeSourceEntiteId`
