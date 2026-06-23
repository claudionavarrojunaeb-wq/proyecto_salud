import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ComunasService } from './comunas.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { QueryComunaDto } from './dto/query-comuna.dto.js';
import { CreateComunaDto } from './dto/create-comuna.dto.js';

describe('ComunasService', () => {
  let service: ComunasService;
  let prisma: {
    comunas: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      comunas: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ComunasService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ComunasService>(ComunasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated comunas', async () => {
    prisma.comunas.findMany.mockResolvedValue([
      { comuna_id: 1, nombre: 'Iquique', provincia_id: 1 },
    ]);
    prisma.comunas.count.mockResolvedValue(1);

    const query = new QueryComunaDto();
    query.page = 1;
    query.limit = 20;

    const result = await service.findAll(query);

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
    expect(prisma.comunas.findMany).toHaveBeenCalled();
  });

  it('should throw NotFoundException when comuna does not exist', async () => {
    prisma.comunas.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a comuna with creado_por', async () => {
    prisma.comunas.create.mockResolvedValue({
      comuna_id: 1,
      nombre: 'Iquique',
      provincia_id: 1,
    });

    const dto = new CreateComunaDto();
    dto.nombre = 'Iquique';
    dto.provincia_id = 1;
    dto.codigo = '01101';

    const result = await service.create(dto, 1);

    expect(result.comuna_id).toBe(1);
    expect(prisma.comunas.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ creado_por: 1 }),
      }),
    );
  });

  it('should soft delete a comuna by setting activo to false', async () => {
    prisma.comunas.findUnique.mockResolvedValue({
      comuna_id: 1,
      nombre: 'Iquique',
      provincia_id: 1,
      activo: true,
    });
    prisma.comunas.update.mockResolvedValue({
      comuna_id: 1,
      nombre: 'Iquique',
      provincia_id: 1,
      activo: false,
    });

    await service.remove(1);

    expect(prisma.comunas.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { comuna_id: 1 },
        data: { activo: false },
      }),
    );
  });
});
