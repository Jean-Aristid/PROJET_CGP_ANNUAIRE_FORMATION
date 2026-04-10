# Manuel utilisateur — CGP Annuaire Formation

## Présentation de l'application

**CGP Annuaire Formation** est une application web permettant de gérer l'annuaire des responsables de formations universitaires. Elle regroupe dans un seul outil :

- La **recherche** dans l'annuaire des responsables, formations et structures
- La **gestion des affectations** (qui est responsable de quoi, et pour quelle année)
- La **gestion des délégations** de droits
- Le **suivi des signalements** d'erreurs dans l'annuaire
- La **génération d'organigrammes** des structures
- L'**import/export** des données

L'accès à certaines fonctionnalités dépend du **rôle** de l'utilisateur dans l'université.

---

## Connexion

L'application utilise l'authentification universitaire. En mode développement, un sélecteur d'utilisateur permet de se connecter sous différents profils pour tester les fonctionnalités.

Une fois connecté, votre **nom**, votre **rôle** et l'**année universitaire courante** s'affichent en haut de l'interface.

---

## Rôles et permissions

| Rôle | Description | Accès principaux |
|---|---|---|
| **Services Centraux** | Administration générale | Accès complet à toutes les fonctionnalités |
| **Directeur de composante** | Directeur d'UFR, Institut ou IUT | Gestion des responsables de sa composante, délégations, organigrammes |
| **Directeur administratif** | Responsable administratif | Gestion des affectations et délégations |
| **Responsable de mention** | Responsable d'une mention de diplôme | Consultation et édition de sa mention |
| **Responsable de parcours** | Responsable d'un parcours | Consultation et édition de son parcours |
| **Secrétariat pédagogique** | Secrétariat | Consultation de l'annuaire |

---

## Navigation

L'interface est organisée en sections dans le menu latéral :

### Essentiel
- **Tableau de bord** — Vue d'ensemble avec statistiques
- **Annuaire / Recherche** — Recherche dans l'annuaire
- **Organigramme** — Visualisation des structures
- **Import / Export** — Import et export de données

### Gestion
- **Responsables** — Gestion des affectations de responsables
- **Structures** — Gestion des entités organisationnelles
- **Rôles** — Demandes et validation de rôles

### Administration
- **Délégations** — Gestion des délégations de droits
- **Années universitaires** — Gestion du cycle annuel
- **Signalements** — Suivi des erreurs signalées

### Paramètres
- **Journal d'audit** — Historique des actions (Services Centraux uniquement)
- **Mon profil** — Modification de vos informations

---

## Tableau de bord

Le tableau de bord affiche un résumé de l'état de l'annuaire pour l'année universitaire courante :

- Nombre de composantes actives
- Nombre de mentions et parcours
- Nombre de responsables affectés
- Signalements ouverts
- Délégations actives

Utilisez le sélecteur d'année en haut de page pour changer l'année consultée.

---

## Recherche dans l'annuaire

La recherche est organisée en quatre onglets :

### Onglet Responsables
Recherchez les responsables par nom, prénom ou entité. Les résultats affichent :
- Nom et prénom
- Rôle dans l'établissement
- Entité de rattachement
- Email et téléphone de contact

**Filtres disponibles :** composante, année universitaire

### Onglet Formations
Recherchez des mentions et parcours par nom ou type de diplôme (Licence, Master, DUT…).

### Onglet Structures
Recherchez dans l'arborescence des composantes, départements et entités.

### Onglet Secrétariats
Retrouvez les coordonnées des secrétariats pédagogiques.

---

## Gestion des responsables

> Accessible aux rôles : Directeur de composante, Directeur administratif, Services Centraux

### Consulter les affectations

La liste affiche tous les responsables affectés avec :
- Nom de l'utilisateur
- Rôle attribué
- Entité concernée
- Dates de début et de fin

### Créer une affectation

1. Cliquer sur **Nouvelle affectation**
2. Sélectionner l'utilisateur
3. Choisir le rôle
4. Sélectionner l'entité (composante, mention, parcours…)
5. Définir les dates de début et de fin
6. Valider

> La date de fin doit être postérieure ou égale à la date de début.

### Modifier une affectation

1. Cliquer sur l'affectation dans la liste
2. Modifier les champs souhaités
3. Enregistrer

### Ajouter des informations de contact

Chaque affectation peut avoir des coordonnées de contact spécifiques au rôle (différentes du profil personnel) :
1. Ouvrir l'affectation
2. Aller dans l'onglet **Contact**
3. Renseigner l'email fonctionnel, le téléphone et le bureau
4. Enregistrer

### Supprimer une affectation

Cliquer sur l'icône de suppression dans la liste. Cette action est définitive.

---

## Gestion des structures

> Accessible en écriture aux : Services Centraux

La liste des structures affiche l'arborescence :
- Composantes (UFR, IUT, Instituts)
  - Départements
  - Mentions
    - Parcours
    - Niveaux

### Modifier une structure

1. Cliquer sur la structure dans l'arborescence
2. Modifier le nom, les coordonnées de service, les informations spécifiques
3. Enregistrer

---

## Gestion des rôles

### Demander un nouveau rôle

Si vous avez besoin d'accéder à des fonctionnalités supplémentaires :

1. Aller dans **Rôles** → **Mes demandes**
2. Cliquer sur **Nouvelle demande**
3. Sélectionner le rôle souhaité
4. Décrire la justification
5. Soumettre

La demande sera examinée par les Services Centraux. Vous recevrez une notification lors de sa validation ou de son refus.

### Valider une demande de rôle (Services Centraux)

1. Aller dans **Rôles** → **Demandes à traiter**
2. Cliquer sur une demande
3. Consulter la justification
4. Cliquer **Valider** ou **Refuser**

---

## Délégations

Une délégation permet de confier temporairement vos droits à un autre utilisateur (ex : pendant une absence).

### Créer une délégation

> Accessible aux rôles : Directeur de composante, Directeur administratif, Responsable de mention, Responsable de parcours

1. Aller dans **Délégations** → **Nouvelle délégation**
2. Choisir le **délégataire** (personne à qui déléguer)
3. Sélectionner l'**entité** concernée
4. Choisir le **rôle** délégué
5. Définir la **période** (dates de début et de fin)
6. Valider

> Vous ne pouvez déléguer que sur des entités où vous êtes vous-même affecté.

### Révoquer une délégation

Dans la liste des délégations, cliquer sur **Révoquer** en face de la délégation concernée. La délégation passe au statut `ANNULEE`.

### Consulter les délégations reçues

L'onglet **Délégations reçues** liste les droits qui vous ont été délégués par d'autres responsables.

---

## Signalements

Les signalements permettent de remonter des erreurs ou incohérences détectées dans l'annuaire.

### Créer un signalement

1. Cliquer sur **Nouveau signalement**
2. Décrire le problème constaté
3. Indiquer le type d'erreur (erreur de responsable, données incorrectes…)
4. Lier le signalement à l'entité ou à l'utilisateur concerné (optionnel)
5. Soumettre

### Suivre ses signalements

La liste affiche vos signalements avec leur statut :
- **Ouvert** : non encore pris en charge
- **En cours** : en cours de traitement
- **Clôturé** : résolu

### Escalader un signalement (responsables)

Si un signalement n'est pas traité, vous pouvez l'escalader vers les Services Centraux :
1. Ouvrir le signalement
2. Cliquer sur **Escalader aux services centraux**

### Traiter un signalement (responsables / Services Centraux)

1. Ouvrir le signalement dans la liste des signalements à traiter
2. Modifier le statut (`En cours` → `Clôturé`)
3. Ajouter un commentaire explicatif
4. Enregistrer

---

## Organigrammes

### Consulter l'organigramme

Aller dans **Organigramme** pour visualiser l'arborescence de l'établissement avec les responsables affectés à chaque niveau.

L'organigramme le plus récent s'affiche par défaut.

### Générer un organigramme

> Accessible aux rôles : Directeur de composante, Directeur administratif, Services Centraux

1. Aller dans **Organigramme**
2. Cliquer sur **Générer un organigramme**
3. L'organigramme est créé à partir des affectations actives

### Exporter l'organigramme

Cliquer sur **Exporter** pour télécharger l'organigramme en PDF.

### Figer un organigramme (Services Centraux)

Figer un organigramme empêche sa modification. Il devient une référence officielle.
1. Sélectionner l'organigramme
2. Cliquer sur **Figer**

---

## Import / Export

> Accessible selon le type d'opération (voir ci-dessous)

### Exporter les responsables (Services Centraux)

1. Aller dans **Import / Export** → onglet **Export**
2. Cliquer sur **Exporter les responsables**
3. Télécharger le fichier CSV généré

### Exporter le classeur standard (Services Centraux)

1. Aller dans **Import / Export** → onglet **Export**
2. Cliquer sur **Exporter le classeur**
3. Télécharger le fichier `.xlsx`

### Importer des responsables

L'import se fait en deux étapes pour éviter les erreurs :

**Étape 1 — Prévisualisation**
1. Aller dans **Import / Export** → onglet **Import**
2. Sélectionner le fichier CSV
3. Cliquer sur **Prévisualiser**
4. Vérifier les données dans le tableau de prévisualisation (créations, mises à jour, erreurs)

**Étape 2 — Confirmation**
5. Si tout est correct, cliquer sur **Confirmer l'import**
6. L'application applique les modifications

> En cas d'erreurs détectées à l'étape 1, corrigez le fichier CSV et recommencez la prévisualisation.

### Format du fichier CSV d'import

Le fichier CSV doit respecter les colonnes suivantes (avec en-tête) :

```csv
login,nom,prenom,role,entite,date_debut,date_fin
jdupont,Dupont,Jean,RESPONSABLE_MENTION,Mention Informatique,2024-09-01,2025-08-31
```

---

## Gestion des années universitaires

> Accessible aux : Services Centraux

### Consulter les années

La liste affiche toutes les années avec leur statut :
- **En cours** : année active
- **En préparation** : année suivante en construction
- **Archivée** : année passée

### Cloner une année

Pour préparer la prochaine année universitaire à partir de la structure actuelle :

1. Aller dans **Années universitaires**
2. Cliquer sur **Cloner** en face de l'année courante
3. Une nouvelle année est créée avec les mêmes structures

### Changer le statut d'une année

1. Sélectionner l'année
2. Modifier le statut via le menu déroulant
3. Enregistrer

---

## Mon profil

Accessible depuis le menu en haut à droite ou via **Paramètres** → **Mon profil**.

Vous pouvez y modifier :
- Votre prénom et nom d'affichage
- Votre email institutionnel
- Votre téléphone
- Votre bureau

Les modifications sont enregistrées immédiatement.

---

## Notifications

L'icône de cloche en haut à droite affiche le nombre de notifications non lues.

Les notifications sont envoyées automatiquement lors :
- De la validation ou du refus d'une demande de rôle
- De la clôture d'un signalement que vous avez déposé
- D'une délégation qui vous est accordée ou révoquée

Cliquer sur une notification l'ouvre et la marque comme lue.

---

## Journal d'audit

> Accessible aux : Services Centraux uniquement

Le journal d'audit enregistre toutes les actions effectuées dans l'application :
- Créations, modifications et suppressions de données
- Auteur de l'action et horodatage
- Valeurs avant et après modification

### Filtrer le journal

Utilisez les filtres disponibles :
- **Type d'action** (CREATE, UPDATE, DELETE)
- **Période** (date de début / date de fin)
- **Utilisateur auteur**

### Exporter le journal

Cliquer sur **Exporter CSV** pour télécharger le journal d'audit complet ou filtré.

---

## Questions fréquentes

**Je ne vois pas certaines fonctionnalités dans le menu.**  
Votre rôle ne vous autorise pas à y accéder. Contactez un directeur de composante ou les services centraux pour faire une demande de rôle.

**Je ne retrouve pas un responsable dans l'annuaire.**  
Vérifiez que vous consultez la bonne année universitaire (sélecteur en haut de page). Le responsable est peut-être affecté sur une autre année.

**Une information est incorrecte dans l'annuaire.**  
Utilisez la fonctionnalité **Signalements** pour remonter l'erreur. Elle sera traitée par le responsable concerné ou les services centraux.

**J'ai besoin de déléguer mes droits pendant mon absence.**  
Allez dans **Délégations** → **Nouvelle délégation** et définissez la période et le délégataire.

**Comment préparer l'année universitaire suivante ?**  
Les Services Centraux peuvent cloner l'année courante depuis **Années universitaires** → **Cloner**. Les structures sont copiées et peuvent ensuite être ajustées.
