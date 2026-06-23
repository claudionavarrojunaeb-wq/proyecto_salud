import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RegionesService } from './regiones.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { QueryRegionDto } from './dto/query-region.dto.js';
import { CreateRegionDto } from './dto/create-region.dto.js';

describe('RegionesService', () => {
  let service: RegionesService;
  let prisma: {
    regiones: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      regiones: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RegionesService>(RegionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated regiones', async () => {
    prisma.regiones.findMany.mockResolvedValue([
      { region_id: 1, codigo: '01', nombre: 'Tarapaca' },
    ]);
    prisma.regiones.count.mockResolvedValue(1);

    const query = new QueryRegionDto();
    query.page = 1;
    query.limit = 20;

    const result = await service.findAll(query);

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
    expect(prisma.regiones.findMany).toHaveBeenCalled();
  });

  it('should throw NotFoundException when region does not exist', async () => {
    prisma.regiones.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a region with creado_por', async () => {
    prisma.regiones.create.mockResolvedValue({
      region_id: 1,
      codigo: '01',
      nombre: 'Tarapaca',
    });

    const dto = new CreateRegionDto();
    dto.codigo = '01';
    dto.nombre = 'Tarapaca';

    const result = await service.create(dto, 1);

    expect(result.region_id).toBe(1);
    expect(prisma.regiones.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ creado_por: 1 }),
      }),
    );
  });

  it('should soft delete a region by setting activo to false', async () => {
    prisma.regiones.findUnique.mockResolvedValue({
      region_id: 1,
      codigo: '01',
      nombre: 'Tarapaca',
      activo: true,
    });
    prisma.regiones.update.mockResolvedValue({
      region_id: 1,
      codigo: '01',
      nombre: 'Tarapaca',
      activo: false,
    });

    await service.remove(1);

    expect(prisma.regiones.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { region_id: 1 },
        data: { activo: false },
      }),
    );
  });
});
