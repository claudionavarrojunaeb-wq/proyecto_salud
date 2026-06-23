import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';

describe('NotificacionesService', () => {
  let service: NotificacionesService;
  let prisma: {
    notificaciones: {
      findMany: jest.Mock<any>;
      count: jest.Mock<any>;
      findUnique: jest.Mock<any>;
      create: jest.Mock<any>;
      update: jest.Mock<any>;
      delete: jest.Mock<any>;
    };
  };

  beforeEach(async () => {
    prisma = {
      notificaciones: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificacionesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NotificacionesService>(NotificacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated notificaciones', async () => {
      const mockData = [
        { notificacion_id: 1, titulo: 'Test', mensaje: 'Mensaje' },
      ];
      prisma.notificaciones.findMany.mockResolvedValue(mockData);
      prisma.notificaciones.count.mockResolvedValue(1);

      const result = await service.findAll({
        page: 1,
        limit: 20,
        skip: 0,
        take: 20,
      });

      expect(result.data).toEqual(mockData);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(prisma.notificaciones.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      );
    });

    it('should filter by usuario_id, leida and tipo', async () => {
      prisma.notificaciones.findMany.mockResolvedValue([]);
      prisma.notificaciones.count.mockResolvedValue(0);

      await service.findAll({
        usuario_id: 1,
        leida: false,
        tipo: 'INFO',
        page: 1,
        limit: 20,
        skip: 0,
        take: 20,
      });

      expect(prisma.notificaciones.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            usuario_id: 1,
            leida: false,
            tipo: 'INFO',
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a notificacion when found', async () => {
      const mockNotificacion = {
        notificacion_id: 1,
        titulo: 'Test',
        mensaje: 'Mensaje',
      };
      prisma.notificaciones.findUnique.mockResolvedValue(mockNotificacion);

      const result = await service.findOne(1);

      expect(result).toEqual(mockNotificacion);
      expect(prisma.notificaciones.findUnique).toHaveBeenCalledWith({
        where: { notificacion_id: 1 },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.notificaciones.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new notificacion', async () => {
      const dto = {
        usuario_id: 1,
        tipo: 'INFO',
        titulo: 'Test',
        mensaje: 'Mensaje',
      };
      const mockNotificacion = { notificacion_id: 1, ...dto };
      prisma.notificaciones.create.mockResolvedValue(mockNotificacion);

      const result = await service.create(dto);

      expect(result).toEqual(mockNotificacion);
      expect(prisma.notificaciones.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: 1,
          tipo: 'INFO',
          titulo: 'Test',
          mensaje: 'Mensaje',
        }),
      });
    });
  });

  describe('update', () => {
    it('should update a notificacion', async () => {
      const dto = { titulo: 'Updated' };
      const mockNotificacion = { notificacion_id: 1, titulo: 'Updated' };
      prisma.notificaciones.update.mockResolvedValue(mockNotificacion);

      const result = await service.update(1, dto);

      expect(result).toEqual(mockNotificacion);
      expect(prisma.notificaciones.update).toHaveBeenCalledWith({
        where: { notificacion_id: 1 },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('should hard delete a notificacion', async () => {
      prisma.notificaciones.delete.mockResolvedValue({ notificacion_id: 1 });

      await service.remove(1);

      expect(prisma.notificaciones.delete).toHaveBeenCalledWith({
        where: { notificacion_id: 1 },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark a notificacion as read', async () => {
      prisma.notificaciones.findUnique.mockResolvedValue({
        notificacion_id: 1,
        leida: false,
      });
      prisma.notificaciones.update.mockResolvedValue({
        notificacion_id: 1,
        leida: true,
      });

      const result = await service.markAsRead(1);

      expect(result.leida).toBe(true);
      expect(prisma.notificaciones.update).toHaveBeenCalledWith({
        where: { notificacion_id: 1 },
        data: { leida: true },
      });
    });

    it('should throw NotFoundException when notificacion not found', async () => {
      prisma.notificaciones.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead(999)).rejects.toThrow(NotFoundException);
    });
  });
});
