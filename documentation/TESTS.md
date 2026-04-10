# Guide des tests — CGP Annuaire Formation

## Vue d'ensemble

Le projet utilise **Jest** comme framework de test. Deux types de tests sont disponibles :

| Type | Emplacement | Outil |
|---|---|---|
| Tests unitaires | `backend-nest/src/**/*.spec.ts` | Jest + ts-jest |
| Tests E2E (bout en bout) | `backend-nest/test/*.e2e-spec.ts` | Jest + Supertest |

---

## Lancer les tests

### Via Docker (recommandé)

```bash
# Tests unitaires
docker compose exec backend-nest npm run test

# Tests unitaires en mode watch
docker compose exec backend-nest npm run test:watch

# Tests avec rapport de couverture
docker compose exec backend-nest npm run test:cov

# Tests E2E
docker compose exec backend-nest npm run test:e2e

# Tests en mode debug (Node Inspector)
docker compose exec backend-nest npm run test:debug
```

### En local

```bash
cd backend-nest

# Tests unitaires
npm run test

# Mode watch (relance automatiquement à chaque modification)
npm run test:watch

# Rapport de couverture (génère dans coverage/)
npm run test:cov

# Tests E2E
npm run test:e2e
```

---

## Tests unitaires existants

### 1. `app.controller.spec.ts` — Health check

**Fichier :** `backend-nest/src/app.controller.spec.ts`

**Ce qui est testé :** la route `GET /health` et la connectivité à la base de données.

```
✓ retourne { status: "ok" } quand la DB est connectée
```

**Configuration :** le PrismaService est mocké pour éviter une connexion réelle.

---

### 2. `affectations.service.spec.ts` — Service des affectations

**Fichier :** `backend-nest/src/modules/affectations/affectations.service.spec.ts`

**Ce qui est testé :**

```
create()
  ✓ rejette si date_fin < date_debut (BadRequestException)
  ✓ accepte si date_fin == date_debut (même jour)

findOne()
  ✓ retourne l'affectation existante par son ID
  ✓ lève une NotFoundException si l'ID n'existe pas
```

---

### 3. `delegations.service.spec.ts` — Service des délégations

**Fichier :** `backend-nest/src/modules/delegations/delegations.service.spec.ts`

**Ce qui est testé :**

```
create()
  ✓ rejette si le délégant n'a pas d'affectation sur l'entité (ForbiddenException)
  ✓ SERVICES_CENTRAUX peut déléguer sans affectation directe sur l'entité

revoke()
  ✓ le délégant peut révoquer sa propre délégation
  ✓ SERVICES_CENTRAUX peut révoquer n'importe quelle délégation
  ✓ un utilisateur tiers ne peut pas révoquer (ForbiddenException)
```

---

### 4. `roles.service.spec.ts` — Service des rôles

**Fichier :** `backend-nest/src/modules/roles/roles.service.spec.ts`

**Ce qui est testé :**

```
findAll()
  ✓ retourne les rôles en camelCase (pas snake_case)
  ✓ les rôles sont triés par niveauHierarchique ASC
```

---

### 5. `users.service.spec.ts` — Service des utilisateurs

**Fichier :** `backend-nest/src/modules/users/users.service.spec.ts`

**Ce qui est testé :**

```
remove()
  ✓ effectue une suppression douce (statut → INACTIF, pas de DELETE réel)
  ✓ lève une NotFoundException si l'utilisateur n'existe pas ou ID invalide
```

---

## Écrire un nouveau test unitaire

### Structure type d'un fichier `.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MonService } from './mon.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MonService', () => {
  let service: MonService;
  let prisma: PrismaService;

  // Mock du PrismaService
  const prismaMock = {
    monModele: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<MonService>(MonService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('maMethode()', () => {
    it('doit retourner le bon résultat', async () => {
      prismaMock.monModele.findUnique.mockResolvedValue({ id: 1, nom: 'Test' });

      const result = await service.maMethode(1);

      expect(result).toEqual({ id: 1, nom: 'Test' });
      expect(prismaMock.monModele.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('doit lever une exception si non trouvé', async () => {
      prismaMock.monModele.findUnique.mockResolvedValue(null);

      await expect(service.maMethode(999)).rejects.toThrow(NotFoundException);
    });
  });
});
```

### Bonnes pratiques

- **Toujours mocker** `PrismaService` dans les tests unitaires — ne jamais toucher une vraie base de données.
- **Nettoyer les mocks** avec `jest.clearAllMocks()` dans `afterEach`.
- **Tester les cas d'erreur** autant que les cas nominaux.
- **Un `describe` par méthode** du service testé.
- **Nommer les tests en français** pour rester cohérent avec le projet.

---

## Tests E2E

Les tests E2E lancent une application NestJS complète avec une base de données de test et vérifient les routes HTTP de bout en bout.

### Configuration

Le fichier de configuration E2E se trouve dans `backend-nest/test/jest-e2e.json`.

### Lancer les tests E2E

```bash
# Avec Docker (base de test isolée recommandée)
docker compose exec backend-nest npm run test:e2e

# En local (nécessite une base PostgreSQL accessible)
cd backend-nest
npm run test:e2e
```

### Structure type d'un test E2E

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /users — retourne la liste des utilisateurs', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('x-user-login', 'admin_sc')   // mock auth header
      .expect(200)
      .expect((res) => {
        expect(res.body.items).toBeDefined();
        expect(Array.isArray(res.body.items)).toBe(true);
      });
  });
});
```

---

## Rapport de couverture

```bash
npm run test:cov
```

Le rapport HTML est généré dans `backend-nest/coverage/lcov-report/index.html`.

### Objectifs de couverture recommandés

| Couche | Cible |
|---|---|
| Services | > 80 % |
| Controllers | > 60 % |
| Guards / Interceptors | > 70 % |

---

## Configuration Jest

**Fichier :** `backend-nest/package.json` (section `jest`)

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

---

## Intégration continue (CI)

Pour intégrer les tests dans un pipeline CI/CD, voici les commandes à utiliser :

```bash
# Dans un pipeline Docker
docker compose run --rm backend-nest npm run test -- --forceExit
docker compose run --rm backend-nest npm run test:e2e -- --forceExit

# Sans Docker (Node directement disponible)
cd backend-nest
npm ci
npm run test -- --forceExit --ci
```

### Variables d'environnement pour CI

```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:1234@localhost:5432/CGP_test
AUTH_MODE=mock
```
