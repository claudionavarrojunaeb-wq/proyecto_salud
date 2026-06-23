import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from './config/config.module.js';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { HealthModule } from './health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';
import { RolesModule } from './modules/roles/roles.module.js';
import { PermisosModule } from './modules/permisos/permisos.module.js';
import { RegionesModule } from './modules/regiones/regiones.module.js';
import { ProvinciasModule } from './modules/provincias/provincias.module.js';
import { ComunasModule } from './modules/comunas/comunas.module.js';
import { PrestadoresModule } from './modules/prestadores/prestadores.module.js';
import { NotificacionesModule } from './modules/notificaciones/notificaciones.module.js';
import { AuditoriaModule } from './modules/auditoria/auditoria.module.js';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env['NODE_ENV'] !== 'production'
            ? {
                target: 'pino-pretty',
                options: { colorize: true, translateTime: 'SYS:standard' },
              }
            : undefined,
        autoLogging: true,
      },
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsuariosModule,
    RolesModule,
    PermisosModule,
    RegionesModule,
    ProvinciasModule,
    ComunasModule,
    PrestadoresModule,
    NotificacionesModule,
    AuditoriaModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
