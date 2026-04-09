# Recette et Tests

Etat du document: avril 2026.

## 1. Etat actuel des tests automatises

### 1.1 Backend

Tests presents dans le depot:

- `src/app.controller.spec.ts`
- `src/modules/affectations/affectations.service.spec.ts`
- `src/modules/delegations/delegations.service.spec.ts`
- `src/modules/roles/roles.service.spec.ts`
- `src/modules/users/users.service.spec.ts`
- `test/app.e2e-spec.ts`

Commandes utiles:

```bash
docker compose exec backend-nest sh -lc "npm run test"
docker compose exec backend-nest sh -lc "npm run test:e2e"
docker compose exec backend-nest sh -lc "npm run test:cov"
```

### 1.2 Frontend

Il n'existe pas de suite de tests frontend dediee dans le depot.

La qualite UI repose donc principalement sur:

- le build TypeScript / Vite
- la verification manuelle
- la coherence des contrats d'API

## 2. Verification minimale avant merge

```bash
docker compose exec frontend sh -lc "npm run build"
docker compose exec backend-nest sh -lc "npm run build"
docker compose exec backend-nest sh -lc "npm run test"
```

## 3. Pre-conditions de recette

Verifier avant la recette:

- qu'une annee `EN_COURS` existe
- qu'au moins une composante, un departement et une mention sont presents
- qu'au moins un utilisateur avec affectation existe
- qu'un login de test connu est disponible dans la table `utilisateur`
- que la stack Docker est bien demarree

## 4. Recette fonctionnelle par domaine

### 4.1 Authentification mock

Scenarios:

- se connecter avec un login existant
- refuser un login inexistant
- verifier l'appel `/api/auth/me`
- verifier la persistance locale du login

### 4.2 Navigation et droits

Scenarios:

- verifier qu'un service central voit tous les ecrans de gestion
- verifier qu'un role plus restreint ne voit pas les ecrans interdits
- verifier qu'un utilisateur simple garde l'acces a la recherche et au profil

### 4.3 Recherche annuaire

Scenarios generaux:

- rechercher un responsable par nom
- rechercher une structure par mot-cle
- rechercher une formation par mention ou parcours
- tester un filtre hierarchique progressif composante vers niveau
- tester une recherche directe par identifiant connu

Scenarios specifiques profils globaux:

- verifier qu'un `services-centraux` voit le selecteur de perimetre
- basculer sur une annee precise puis sur `Toute la base`
- verifier que l'annee apparait sur les resultats en mode `Toute la base`

Scenarios profils non globaux:

- verifier que le selecteur `Toute la base` n'est pas disponible
- verifier que l'API refuse une recherche sans `yearId`

### 4.4 Gestion des responsables

Scenarios:

- creer un utilisateur
- modifier ses informations:
  nom, prenom, email principal, email secondaire, civilite, categorie, telephone, bureau
- ajouter une affectation
- modifier une affectation existante:
  role, structure, dates, coordonnees fonctionnelles
- supprimer une affectation
- supprimer un utilisateur autorise

### 4.5 Fiches structures

Scenarios:

- ouvrir le detail d'une structure
- verifier la remontee responsables et secretariat
- verifier les sous-structures directes
- modifier les champs communs d'une structure
- modifier les champs specifiques selon le type:
  composante, departement, mention, parcours, niveau
- verifier qu'un profil non autorise ne peut pas modifier la fiche

### 4.6 Delegations

Scenarios:

- creer une delegation valide
- verifier que le modal de creation ne propose pas toute la base
- verifier que les filtres hierarchiques resserrent la liste des structures proposees
- verifier qu'un profil non central ne peut choisir qu'une structure d'affectation directe
- verifier les droits disponibles:
  `view`, `manage_responsables`, `assign_role`, `validate_signalement`, `generate_orgchart`, `import_data`, `full`
- verifier la visibilite de la delegation creee
- revoquer la delegation
- exporter le CSV cote service central

### 4.7 Organigrammes

Scenarios:

- generer un organigramme de structure
- basculer en vue personnes
- filtrer par role
- filtrer par hierarchie structurelle
- exporter en PDF
- exporter en JSON ou CSV
- figer puis defiger un organigramme si le profil est service central
- ouvrir un organigramme deja genere depuis la bibliotheque

### 4.8 Annees universitaires

Scenarios:

- verifier qu'un `services-centraux` peut changer d'annee
- verifier qu'un autre profil reste borne a l'annee courante
- creer une annee vide
- cloner une annee complete
- cloner une annee avec structures selectionnees
- creer une annee sans affectations
- activer une annee
- archiver une annee
- supprimer une annee et verifier le telechargement de la sauvegarde workbook

### 4.9 Import / Export

Imports herites:

- importer un CSV responsables valide
- exclure certaines lignes a la confirmation
- verifier la creation des utilisateurs et affectations

Workbook standardise:

- telecharger un export standard d'annee
- telecharger un modele vide
- modifier le fichier dans Excel
- recharger le fichier cote UI
- lancer la preview
- verifier les compteurs `create`, `update`, `reuse`, `skip`, `warning`, `error`
- confirmer l'import
- repeter avec import limite a une structure
- repeter avec creation de l'annee cible

### 4.10 Signalements

Scenarios:

- creer un signalement
- le faire prendre en charge
- le faire escalader
- le cloturer avec commentaire
- verifier la notification associee si applicable

### 4.11 Audit

Scenarios:

- verifier qu'une action sensible cree un log
- filtrer le journal d'audit
- exporter le CSV d'audit

## 5. Non-regression ciblee

### 5.1 Si modification du schema Prisma

Verifier:

- migrations ou `db push`
- seeds et imports encore fonctionnels
- pages frontend utilisant les champs modifies
- documentation synchronisee

### 5.2 Si modification des roles ou gardes

Verifier:

- acces a l'ecran
- acces API direct
- visibilite des actions dans l'UI
- absence de fuite hors perimetre structure ou annee

### 5.3 Si modification de la recherche

Verifier:

- chargement sans ecran blanc
- cohérence de `/roles` cote frontend
- recherche annee precise
- recherche `Toute la base` pour profils globaux
- refus backend sans `yearId` pour profils non autorises

### 5.4 Si modification des delegations

Verifier:

- modal de creation lisible
- perimetre borne correctement
- correspondance entre droits UI et droits backend
- impossibilite de deleguer sur une structure non autorisee

### 5.5 Si modification de la gestion responsables / structures

Verifier:

- les modaux affichent bien les champs attendus
- la sauvegarde persiste tous les nouveaux champs
- les ecrans restent cohérents apres rechargement

## 6. Recommandation pratique

En l'absence de tests frontend automatises, toute evolution significative doit etre validee au minimum par:

1. build frontend dans Docker
2. build backend dans Docker
3. parcours manuel du domaine modifie
4. controle des permissions avec au moins deux profils
