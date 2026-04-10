import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './common/prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let prismaService: { $queryRawUnsafe: jest.Mock };

  beforeEach(async () => {
    prismaService = {
      $queryRawUnsafe: jest.fn().mockResolvedValue(1),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return status ok', async () => {
      await expect(appController.health()).resolves.toEqual({ status: 'ok' });
      expect(prismaService.$queryRawUnsafe).toHaveBeenCalledWith('SELECT 1');
    });
  });
});
