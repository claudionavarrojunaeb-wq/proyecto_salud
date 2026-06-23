import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrestadoresService } from './prestadores.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';

describe('PrestadoresService', () => {
  let service: PrestadoresService;
  let prisma: {
    prestadores: {
      findMany: jest.Mock<any>;
      count: jest.Mock<any>;
      findUnique: jest.Mock<any>;
      create: jest.Mock<any>;
      update: jest.Mock<any>;
    };
  };

  beforeEach(async () => {
    prisma = {
      prestadores: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestadoresService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PrestadoresService>(PrestadoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated prestadores', async () => {
      const mockData = [
        { prestador_id: 1, rut: '12345678-9', razon_social: 'Test' },
      ];
      prisma.prestadores.findMany.mockResolvedValue(mockData);
      prisma.prestadores.count.mockResolvedValue(1);

      const result = await service.findAll({
        page: 1,
        limit: 20,
        skip: 0,
        take: 20,
      });

      expect(result.data).toEqual(mockData);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
      expect(result.meta.totalPages).toBe(1);
      expect(prisma.prestadores.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      );
    });

    it('should filter by rut, comuna_id and activo', async () => {
      prisma.prestadores.findMany.mockResolvedValue([]);
      prisma.prestadores.count.mockResolvedValue(0);

      await service.findAll({
        rut: '123',
        comuna_id: 1,
        activo: true,
        page: 1,
        limit: 20,
        skip: 0,
        take: 20,
      });

      expect(prisma.prestadores.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            rut: { contains: '123' },
            comuna_id: 1,
            activo: true,
          }),
        }),
      );
    });

    it('should include Comunas relation', async () => {
      prisma.prestadores.findMany.mockResolvedValue([]);
      prisma.prestadores.count.mockResolvedValue(0);

      await service.findAll({
        page: 1,
        limit: 20,
        skip: 0,
        take: 20,
      });

      expect(prisma.prestadores.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ include: { Comunas: true } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a prestador when found', async () => {
      const mockPrestador = {
        prestador_id: 1,
        rut: '12345678-9',
        razon_social: 'Test',
      };
      prisma.prestadores.findUnique.mockResolvedValue(mockPrestador);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPrestador);
      expect(prisma.prestadores.findUnique).toHaveBeenCalledWith({
        where: { prestador_id: 1 },
        include: { Comunas: true },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.prestadores.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new prestador with creado_por', async () => {
      const dto = { rut: '12345678-9', razon_social: 'Test' };
      const mockPrestador = { prestador_id: 1, ...dto };
      prisma.prestadores.create.mockResolvedValue(mockPrestador);

      const result = await service.create(dto, 10);

      expect(result).toEqual(mockPrestador);
      expect(prisma.prestadores.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          rut: '12345678-9',
          razon_social: 'Test',
          creado_por: 10,
          activo: true,
        }),
      });
    });
  });

  describe('update', () => {
    it('should update a prestador with modificado_por and fecha_modificacion', async () => {
      const dto = { razon_social: 'Updated' };
      const mockPrestador = { prestador_id: 1, razon_social: 'Updated' };
      prisma.prestadores.update.mockResolvedValue(mockPrestador);

      const result = await service.update(1, dto, 10);

      expect(result).toEqual(mockPrestador);
      expect(prisma.prestadores.update).toHaveBeenCalledWith({
        where: { prestador_id: 1 },
        data: expect.objectContaining({
          razon_social: 'Updated',
          modificado_por: 10,
          fecha_modificacion: expect.any(Date),
        }),
      });
    });
  });

  describe('remove', () => {
    it('should soft delete by setting activo to false', async () => {
      prisma.prestadores.update.mockResolvedValue({
        prestador_id: 1,
        activo: false,
      });

      await service.remove(1);

      expect(prisma.prestadores.update).toHaveBeenCalledWith({
        where: { prestador_id: 1 },
        data: { activo: false },
      });
    });
  });
});
