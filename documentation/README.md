# Documentation Projet

Etat de la documentation: avril 2026.

Cette base documentaire couvre l'etat actuel du depot:

- `frontend/`: application React / Vite
- `backend-nest/`: API NestJS / Prisma
- `docker-compose.yml`: orchestration locale
- `files/`: assets et fichiers metier
- `script/`: scripts d'initialisation et utilitaires

## Sommaire

- [MANUEL_UTILISATEUR.md](./MANUEL_UTILISATEUR.md)
  Guide d'usage metier: connexion, recherche, responsables, structures, delegations, imports, signalements.

- [MANUEL_TECHNIQUE.md](./MANUEL_TECHNIQUE.md)
  Vue d'ensemble technique: architecture, modules, roles, flux sensibles, conventions.

- [API_BACKEND.md](./API_BACKEND.md)
  Catalogue des endpoints NestJS, regles d'acces et contrats utiles.

- [EXPLOITATION_MAINTENANCE.md](./EXPLOITATION_MAINTENANCE.md)
  Demarrage Docker, maintenance courante, seeds, migrations, depannage.

- [RECETTE_TEST.md](./RECETTE_TEST.md)
  Strategie de verification, recette manuelle et points de non-regression.

- [captures/README.md](./captures/README.md)
  Convention de nommage et liste des captures a produire pour le manuel utilisateur.

## Points fonctionnels notables documentes

- recherche avancee multi-onglets avec filtres hierarchiques dynamiques
- recherche sur toute la base reservee aux profils globaux autorises
- edition et gestion des responsables avec affectations et contacts fonctionnels
- edition complete des fiches structures par les services centraux
- creation de delegations avec filtrage dynamique et perimetre borne
- exploitation quotidienne via Docker

## Regle de maintenance

Cette documentation doit etre revue a chaque evolution qui touche:

- le schema Prisma
- les routes backend
- les roles ou les gardes d'autorisation
- les ecrans de gestion et leurs filtres
- les formats d'import / export
- les workflows annee universitaire ou organigramme
