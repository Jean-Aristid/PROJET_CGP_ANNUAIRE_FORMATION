# Manuel d'utilisation

Etat du manuel: avril 2026.

## 1. Objectif

Ce manuel explique l'usage quotidien de l'application CGP.

Il s'adresse:

- aux utilisateurs qui consultent l'annuaire
- aux responsables qui gerent leur perimetre
- aux services centraux qui pilotent les donnees et les annees

## 2. Convention pour les captures

Les captures du manuel doivent etre deposees dans `documentation/captures/`.

Convention recommandee:

- format `png`
- une capture par ecran ou action cle
- donnees de demonstration uniquement
- anonymiser les donnees personnelles si necessaire

## 3. Connexion et session

### 3.1 Connexion

L'application s'ouvre sur un ecran de connexion par login.

En environnement de developpement:

- l'utilisateur saisit un login
- l'application recharge ensuite son profil, ses droits et son contexte d'annee

Capture recommandee:

- `01-connexion.png`

### 3.2 Tableau de bord

Apres connexion, l'utilisateur arrive sur le tableau de bord.

Le tableau de bord permet de:

- voir l'annee courante de la session
- ouvrir rapidement les ecrans principaux
- verifier les actions accessibles selon le role

Capture recommandee:

- `02-tableau-de-bord.png`

### 3.3 Changement d'annee

Le changement d'annee est reserve aux `services-centraux`.

Pour les autres roles:

- l'annee `EN_COURS` reste visible dans l'entete
- elle n'est pas modifiable depuis l'interface

Pour les services centraux:

- le selecteur d'annee change le contexte de travail
- les structures, responsables, recherches et exports se recalculent pour l'annee choisie

## 4. Navigation generale

Selon le role, l'utilisateur peut voir les rubriques suivantes:

- `Tableau de bord`
- `Rechercher`
- `Organigramme`
- `Import / Export`
- `Responsables`
- `Fiches structures`
- `Demandes de roles`
- `Delegations`
- `Annees`
- `Audit`
- `Signalements`
- `Ma fiche`

Toutes les rubriques ne sont pas visibles pour tous les profils.

## 5. Recherche avancee

### 5.1 Principe

La rubrique `Rechercher` permet une consultation transversale de l'annuaire sans modifier les donnees.

Les onglets disponibles sont:

- `Responsables`
- `Formations`
- `Structures`
- `Secretariats`

Les filtres disponibles peuvent inclure:

- une recherche texte libre
- des filtres hierarchiques composante vers niveau
- un filtre role pour l'onglet responsables
- un filtre type de structure ou type de diplome selon l'onglet

### 5.2 Recherche sur toute la base

Pour `services-centraux` et `administrateur`, un selecteur de perimetre permet:

- soit de travailler sur une annee precise
- soit de basculer sur `Toute la base`

En mode `Toute la base`:

- la recherche remonte des resultats de plusieurs annees
- l'annee du resultat est affichee dans les cartes
- les structures de filtre sont rechargees dynamiquement pour couvrir l'ensemble du perimetre

Pour les autres roles:

- la recherche reste bornee a leur contexte d'annee autorise

Captures recommandees:

- `03-recherche-responsables.png`
- `04-recherche-globale-sc.png`
- `05-recherche-structures.png`

### 5.3 Conseils d'usage

- commencer par une recherche texte simple
- affiner ensuite avec les filtres hierarchiques
- utiliser les identifiants quand ils sont connus
- pour les services centraux, limiter d'abord le perimetre a une annee si la recherche est trop large

## 6. Fiches structures

La rubrique `Fiches structures` permet de consulter les informations detaillees d'une structure.

Les informations visibles peuvent inclure:

- le type de structure
- le rattachement hierarchique
- les coordonnees du service
- les responsables et le secretariat
- les sous-structures directes
- des champs metier selon le type

Exemples de champs specifiques:

- composante:
  code composante, type de composante, campus, mails, site web
- departement:
  code interne
- mention:
  type de diplome, diplome de reference, cycle
- parcours:
  code parcours
- niveau:
  libelle court

### 6.1 Modification des structures

La modification est reservee aux `services-centraux`.

Le modal d'edition permet de modifier tous les champs lies au type courant.

Captures recommandees:

- `06-fiche-structure.png`
- `07-fiche-structure-edition.png`

## 7. Organigrammes

### 7.1 Vue structures

La vue `Structures` affiche l'organisation des entites et les responsables associes.

### 7.2 Vue personnes

La vue `Personnes` affiche uniquement des personnes reliees par la hierarchie N+1.

Les filtres permettent notamment de cibler:

- un role
- une recherche libre
- une branche hierarchique

### 7.3 Bibliotheque

La bibliotheque des organigrammes deja generes permet de:

- retrouver un organigramme existant
- l'ouvrir en vue structures ou personnes
- filtrer les organigrammes disponibles

Captures recommandees:

- `08-organigramme-structures.png`
- `09-organigramme-personnes.png`
- `10-bibliotheque-organigrammes.png`

## 8. Gestion des responsables

La rubrique `Responsables` permet, selon les droits:

- de rechercher des personnes par nom, login, email, identifiant ou structure
- d'ajouter un utilisateur
- de modifier une fiche personne
- d'ajouter, modifier ou supprimer une affectation

### 8.1 Edition de la fiche personne

Les champs suivants peuvent etre modifies par les profils autorises:

- prenom
- nom
- email institutionnel
- email institutionnel secondaire
- civilite
- categorie
- telephone
- bureau

### 8.2 Edition de l'affectation

Le modal d'edition d'affectation permet de modifier:

- le role
- la structure d'affectation
- la date de debut
- la date de fin
- l'email fonctionnel
- le telephone fonctionnel
- le bureau fonctionnel

### 8.3 Lecture de la fiche

Depuis la liste, l'utilisateur voit aussi:

- les affectations de l'annee
- les roles actifs
- les informations de contact

Captures recommandees:

- `11-responsables.png`
- `12-responsables-edition.png`

## 9. Delegations

La rubrique `Delegations` permet de deleguer certains droits a un autre utilisateur, selon les regles du role courant.

### 9.1 Consultation

L'ecran affiche:

- une liste des delegations visibles
- des filtres par statut
- des filtres hierarchiques dynamiques
- une recherche par identifiant, delegant, delegataire, structure ou droit

### 9.2 Creation

Pour les profils de direction autorises:

- le modal de creation propose d'abord des filtres hierarchiques dynamiques
- la liste du perimetre est volontairement bornee aux structures autorisees
- pour les profils non centraux, seules les structures d'affectation directe peuvent etre choisies

Les droits delegables sont:

- `Lecture`
- `Gestion responsables`
- `Affectation roles`
- `Validation des signalements`
- `Generer organigramme`
- `Import`
- `Acces complet`

### 9.3 Revocation et export

- le delegant concerne peut revoquer sa delegation
- les services centraux peuvent exporter les delegations en CSV

Capture recommandee:

- `13-delegations.png`

## 10. Demandes de roles

La rubrique `Demandes de roles` permet:

- de deposer une demande
- de suivre son statut
- de la traiter pour les profils autorises

Capture recommandee:

- `14-demandes-roles.png`

## 11. Import / Export

La rubrique `Import / Export` permet:

- d'exporter une annee complete
- d'exporter une structure et son sous-arbre
- de telecharger un modele standardise
- de lancer une previsualisation d'import
- d'importer tout un fichier ou un perimetre cible

Bonnes pratiques:

- verifier l'annee cible
- commencer par une preview
- relire les alertes avant confirmation

Captures recommandees:

- `15-import-export.png`
- `16-preview-import.png`

## 12. Annees universitaires

La rubrique `Annees` est reservee aux services centraux.

Elle permet:

- de creer une annee vide
- de cloner une annee source
- de choisir un clonage complet ou selectif
- de copier ou non les affectations
- d'activer ou d'archiver une annee
- de supprimer une annee avec sauvegarde metier

Capture recommandee:

- `17-gestion-annees.png`

## 13. Signalements

La rubrique `Signalements` permet:

- de creer un signalement
- de filtrer les signalements visibles
- de suivre leur prise en charge et leur cloture

Capture recommandee:

- `18-signalements.png`

## 14. Audit

La rubrique `Audit` est reservee aux profils autorises.

Elle permet de:

- consulter les traces
- filtrer les actions
- exporter le journal

Capture recommandee:

- `19-audit.png`

## 15. Profil utilisateur

La rubrique `Ma fiche` permet a l'utilisateur de consulter son profil et, selon les droits exposes par l'ecran, de modifier certains champs personnels.

Capture recommandee:

- `20-profil.png`

## 16. Checklist des captures

Pour un manuel complet, produire idealement:

1. `01-connexion.png`
2. `02-tableau-de-bord.png`
3. `03-recherche-responsables.png`
4. `04-recherche-globale-sc.png`
5. `05-recherche-structures.png`
6. `06-fiche-structure.png`
7. `07-fiche-structure-edition.png`
8. `08-organigramme-structures.png`
9. `09-organigramme-personnes.png`
10. `10-bibliotheque-organigrammes.png`
11. `11-responsables.png`
12. `12-responsables-edition.png`
13. `13-delegations.png`
14. `14-demandes-roles.png`
15. `15-import-export.png`
16. `16-preview-import.png`
17. `17-gestion-annees.png`
18. `18-signalements.png`
19. `19-audit.png`
20. `20-profil.png`
