import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';

describe('AuditoriaService', () => {
  let service: AuditoriaService;
  let prisma: {
    auditoriaAccesos: {
      findMany: jest.Mock<any>;
      count: jest.Mock<any>;
      findUnique: jest.Mock<any>;
    };
    auditLog: {
      findMany: jest.Mock<any>;
      count: jest.Mock<any>;
      findUnique: jest.Mock<any>;
    };
  };

  beforeEach(async () => {
    prisma = {
      auditoriaAccesos: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
      },
      auditLog: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditoriaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AuditoriaService>(AuditoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllAccesos', () => {
    it('should return paginated auditoria accesos', async () => {
      const mockData = [{ log_id: 1n, tipo_evento: 'LOGIN', usuario_id: 1 }];
      prisma.auditoriaAccesos.findMany.mockResolvedValue(mockData);
      prisma.auditoriaAccesos.count.mockResolvedValue(1);

      const result = await service.findAllAccesos({
        page: 1,
        limit: 20,
        skip: 0,
        take: 20,
      });

      expect(result.data).toEqual(mockData);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(prisma.auditoriaAccesos.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      );
    });

    it('should filter by usuario_id and tipo_evento', async () => {
      prisma.auditoriaAccesos.findMany.mockResolvedValue([]);
      prisma.auditoriaAccesos.count.mockResolvedValue(0);

      await service.findAllAccesos({
        usuario_id: 1,
        tipo_evento: 'LOGIN',
        page: 1,
        limit: 20,
        skip: 0,
        take: 20,
      });

      expect(prisma.auditoriaAccesos.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            usuario_id: 1,
            tipo_evento: 'LOGIN',
          }),
        }),
      );
    });

    it('should filter by fecha_evento range', async () => {
      prisma.auditoriaAccesos.findMany.mockResolvedValue([]);
      prisma.auditoriaAccesos.count.mockResolvedValue(0);

      await service.findAllAccesos({
        fechaDesde: '2024-01-01',
        fechaHasta: '2024-12-31',
        page: 1,
        limit: 20,
        skip: 0,
        take: 20,
      });

      expect(prisma.auditoriaAccesos.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            fecha_evento: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        }),
      );
    });
  });

  describe('findOneAcceso', () => {
    it('should return an acceso when found', async () => {
      const mockAcceso = { log_id: 1n, tipo_evento: 'LOGIN', usuario_id: 1 };
      prisma.auditoriaAccesos.findUnique.mockResolvedValue(mockAcceso);

      const result = await service.findOneAcceso(1n);

      expect(result).toEqual(mockAcceso);
      expect(prisma.auditoriaAccesos.findUnique).toHaveBeenCalledWith({
        where: { log_id: 1n },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.auditoriaAccesos.findUnique.mockResolvedValue(null);

      await expect(service.findOneAcceso(999n)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllAuditLogs', () => {
    it('should return paginated audit logs', async () => {
      const mockData = [{ id: 1, tableName: 'usuarios', action: 'CREATE' }];
      prisma.auditLog.findMany.mockResolvedValue(mockData);
      prisma.auditLog.count.mockResolvedValue(1);

      const result = await service.findAllAuditLogs({
        page: 1,
        limit: 20,
        skip: 0,
        take: 20,
      });

      expect(result.data).toEqual(mockData);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      );
    });
  });

  describe('findOneAuditLog', () => {
    it('should return an audit log when found', async () => {
      const mockLog = { id: 1, tableName: 'usuarios', action: 'CREATE' };
      prisma.auditLog.findUnique.mockResolvedValue(mockLog);

      const result = await service.findOneAuditLog(1);

      expect(result).toEqual(mockLog);
      expect(prisma.auditLog.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.auditLog.findUnique.mockResolvedValue(null);

      await expect(service.findOneAuditLog(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
