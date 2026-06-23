# Salud JUNAEB - Backend

Backend del Sistema de Salud de JUNAEB, construido como **monolito modular** con NestJS 11, Prisma 7 y PostgreSQL.

## Stack tecnologico

- **NestJS 11** - Framework de Node.js para aplicaciones server-side
- **Prisma 7** - ORM con type-safety y migraciones
- **PostgreSQL 18** - Base de datos relacional
- **TypeScript 5.7** - Lenguaje (ESM, `module: nodenext`)
- **JWT + bcrypt** - Autenticacion con access/refresh tokens
- **Swagger/OpenAPI** - Documentacion automatica de API
- **Pino** - Logger estructurado JSON
- **Helmet + Throttler** - Seguridad HTTP y rate limiting
- **class-validator** - Validacion de DTOs

## Arquitectura

Monolito modular con modulos NestJS como bounded contexts:

```
src/
  main.ts                      Bootstrap: Swagger, helmet, CORS, pipes, pino
  app.module.ts                Root module: importa config + todos los modulos
  common/                      Kernel compartido (cross-cutting)
    prisma/                    PrismaModule + PrismaService (global)
    decorators/                @Public, @CurrentUser, @Roles
    guards/                    JwtAuthGuard, RolesGuard
    filters/                   HttpExceptionFilter
    dto/                       PaginationDto, PaginatedResponse
    pipes/                     ParseBigIntPipe
  config/                      ConfigModule + validacion de env vars (Joi)
  health/                      GET /health
  modules/                     Bounded contexts
    auth/                      Login, refresh, logout, registro
    usuarios/                  CRUD usuarios
    roles/                     CRUD roles + asignar permisos
    permisos/                  CRUD permisos
    regiones/                  CRUD regiones
    provincias/                CRUD provincias
    comunas/                   CRUD comunas
    prestadores/               DOMINIO CENTRAL: CRUD prestadores
    notificaciones/            CRUD notificaciones
    auditoria/                 Lectura de logs (read-only)
```

## Requisitos previos

- Node.js 22+
- PostgreSQL 16+
- npm 10+

## Instalacion

```bash
npm install
cp .env.example .env  # configurar variables de entorno
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

## Variables de entorno

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/PropuestaSalud?schema=public"
NODE_ENV=development
PORT=3000
JWT_SECRET="cambiar-en-produccion"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGINS="*"
```

## Comandos

```bash
# Desarrollo
npm run start:dev          # Hot reload

# Produccion
npm run build              # Compilar a dist/
npm run start:prod         # Ejecutar build

# Base de datos
npm run prisma:generate    # Regenerar cliente Prisma
npm run prisma:migrate     # Crear migracion
npm run db:seed            # Cargar datos iniciales

# Tests
npm run test               # Tests unitarios
npm run test:e2e           # Tests e2e
npm run test:cov           # Coverage

# Calidad
npm run lint               # ESLint
npm run format             # Prettier
```

## API

- **Base URL**: `http://localhost:3000/api/v1`
- **Swagger docs**: `http://localhost:3000/api/docs`

### Endpoints principales

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | Iniciar sesion (publico) |
| POST | `/api/v1/auth/refresh` | Renovar token (publico) |
| POST | `/api/v1/auth/logout` | Cerrar sesion |
| POST | `/api/v1/auth/register` | Registrar usuario (solo ADMIN) |
| GET | `/health` | Estado de la aplicacion (publico) |
| GET/POST/PATCH/DELETE | `/api/v1/usuarios` | CRUD usuarios |
| GET/POST/PATCH/DELETE | `/api/v1/roles` | CRUD roles |
| POST | `/api/v1/roles/:id/permisos` | Asignar permisos a rol |
| GET/POST/PATCH/DELETE | `/api/v1/permisos` | CRUD permisos |
| GET/POST/PATCH/DELETE | `/api/v1/regiones` | CRUD regiones |
| GET/POST/PATCH/DELETE | `/api/v1/provincias` | CRUD provincias |
| GET/POST/PATCH/DELETE | `/api/v1/comunas` | CRUD comunas |
| GET/POST/PATCH/DELETE | `/api/v1/prestadores` | CRUD prestadores |
| GET/POST/PATCH/DELETE | `/api/v1/notificaciones` | CRUD notificaciones |
| PATCH | `/api/v1/notificaciones/:id/leida` | Marcar como leida |
| GET | `/api/v1/auditoria/accesos` | Logs de accesos |
| GET | `/api/v1/auditoria/logs` | Logs de auditoria |

## Autenticacion

- **Access token**: JWT de 15 min, enviado en `Authorization: Bearer <token>`
- **Refresh token**: UUID aleatorio, 7 dias de validez, almacenado en BD
- **RBAC**: Roles con permisos por modulo (ej: `usuarios:read`, `prestadores:write`)
- **Guardias globales**: ThrottlerGuard + JwtAuthGuard en todas las rutas
- **@Public()**: Excluye rutas de autenticacion
- **@Roles('ADMIN')**: Requiere rol especifico

## Datos iniciales (seed)

- 16 regiones de Chile
- 56 provincias
- 346 comunas
- 3 roles: ADMIN, SUPERVISOR, OPERADOR
- 17 permisos por modulo
- 1 usuario admin: `rut: 11111111-1`, `password: Admin123!`

## Convenciones

- **ESM**: El proyecto usa `"type": "module"`, imports con `.js`
- **Schema Prisma**: Nombres snake_case en español (introspeccionado de BD)
- **Soft delete**: `activo = false` en lugar de DELETE (excepto notificaciones)
- **Paginacion**: Todas las listas retornan `{ data, meta: { total, page, limit, totalPages } }`
- **Validacion**: ValidationPipe global con `whitelist`, `forbidNonWhitelisted`, `transform`
