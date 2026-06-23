import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { PermisosService } from './permisos.service.js';

describe('PermisosService', () => {
  let service: PermisosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermisosService,
        {
          provide: PrismaService,
          useValue: {
            permisos: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PermisosService>(PermisosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
