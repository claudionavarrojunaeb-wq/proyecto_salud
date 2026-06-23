import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProvinciasService } from './provincias.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { QueryProvinciaDto } from './dto/query-provincia.dto.js';
import { CreateProvinciaDto } from './dto/create-provincia.dto.js';

describe('ProvinciasService', () => {
  let service: ProvinciasService;
  let prisma: {
    provincias: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      provincias: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvinciasService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProvinciasService>(ProvinciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated provincias', async () => {
    prisma.provincias.findMany.mockResolvedValue([
      { provincia_id: 1, nombre: 'Iquique', region_id: 1 },
    ]);
    prisma.provincias.count.mockResolvedValue(1);

    const query = new QueryProvinciaDto();
    query.page = 1;
    query.limit = 20;

    const result = await service.findAll(query);

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
    expect(prisma.provincias.findMany).toHaveBeenCalled();
  });

  it('should throw NotFoundException when provincia does not exist', async () => {
    prisma.provincias.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a provincia with creado_por', async () => {
    prisma.provincias.create.mockResolvedValue({
      provincia_id: 1,
      nombre: 'Iquique',
      region_id: 1,
    });

    const dto = new CreateProvinciaDto();
    dto.nombre = 'Iquique';
    dto.region_id = 1;
    dto.codigo = '011';

    const result = await service.create(dto, 1);

    expect(result.provincia_id).toBe(1);
    expect(prisma.provincias.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ creado_por: 1 }),
      }),
    );
  });

  it('should soft delete a provincia by setting activo to false', async () => {
    prisma.provincias.findUnique.mockResolvedValue({
      provincia_id: 1,
      nombre: 'Iquique',
      region_id: 1,
      activo: true,
    });
    prisma.provincias.update.mockResolvedValue({
      provincia_id: 1,
      nombre: 'Iquique',
      region_id: 1,
      activo: false,
    });

    await service.remove(1);

    expect(prisma.provincias.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { provincia_id: 1 },
        data: { activo: false },
      }),
    );
  });
});
