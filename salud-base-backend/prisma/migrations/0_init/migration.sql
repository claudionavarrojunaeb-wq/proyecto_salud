-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" INTEGER NOT NULL,
    "tableName" VARCHAR(100) NOT NULL,
    "recordId" VARCHAR(100) NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "userId" INTEGER,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditoriaAccesos" (
    "log_id" BIGINT NOT NULL,
    "usuario_id" INTEGER,
    "input_login" VARCHAR(255),
    "fecha_evento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_evento" VARCHAR(50) NOT NULL,
    "direccion_ip" VARCHAR(45),
    "user_agent" TEXT,
    "detalle" TEXT,

    CONSTRAINT "PK_AuditoriaAccesos" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "Comunas" (
    "comuna_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "provincia_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "creado_por" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,
    "modificado_por" INTEGER,
    "fecha_modificacion" TIMESTAMP(3),
    "codigo" VARCHAR(10) NOT NULL,

    CONSTRAINT "PK_Comunas" PRIMARY KEY ("comuna_id")
);

-- CreateTable
CREATE TABLE "Notificaciones" (
    "notificacion_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "mensaje" VARCHAR(500) NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_Notificaciones" PRIMARY KEY ("notificacion_id")
);

-- CreateTable
CREATE TABLE "PasswordResetTokens" (
    "id" INTEGER NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "PK__Password__3213E83F2E7C9B97" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permisos" (
    "permiso_id" INTEGER NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "modulo" VARCHAR(50) NOT NULL,
    "accion" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(100),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_por" INTEGER,
    "fecha_modificacion" TIMESTAMP(3),

    CONSTRAINT "PK__Permisos__60B569CD79226DB7" PRIMARY KEY ("permiso_id")
);

-- CreateTable
CREATE TABLE "Prestadores" (
    "prestador_id" INTEGER NOT NULL,
    "rut" VARCHAR(12) NOT NULL,
    "razon_social" VARCHAR(255) NOT NULL,
    "direccion" TEXT,
    "comuna_id" INTEGER,
    "telefono" VARCHAR(20),
    "email" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_por" INTEGER,
    "fecha_modificacion" TIMESTAMP(3),

    CONSTRAINT "PK__Prestado__EE2332185FF08366" PRIMARY KEY ("prestador_id")
);

-- CreateTable
CREATE TABLE "Provincias" (
    "provincia_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "region_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "creado_por" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,
    "modificado_por" INTEGER,
    "fecha_modificacion" TIMESTAMP(3),
    "codigo" VARCHAR(10) NOT NULL,

    CONSTRAINT "PK_Provincias" PRIMARY KEY ("provincia_id")
);

-- CreateTable
CREATE TABLE "RefreshTokens" (
    "id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regiones" (
    "region_id" INTEGER NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_por" INTEGER,
    "fecha_modificacion" TIMESTAMP(3),
    "abreviatura" VARCHAR(10),
    "orden_visual" INTEGER,

    CONSTRAINT "PK__Regiones__01146BAE902E3751" PRIMARY KEY ("region_id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "rol_id" INTEGER NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "requiere_contexto" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_por" INTEGER,
    "fecha_modificacion" TIMESTAMP(3),

    CONSTRAINT "PK__Roles__CF32E443FAC8A974" PRIMARY KEY ("rol_id")
);

-- CreateTable
CREATE TABLE "RolesPermisos" (
    "rol_id" INTEGER NOT NULL,
    "permiso_id" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_RolesPermisos" PRIMARY KEY ("rol_id","permiso_id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "usuario_id" INTEGER NOT NULL,
    "rut" VARCHAR(12) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "primer_apellido" VARCHAR(100) NOT NULL,
    "segundo_apellido" VARCHAR(100),
    "tipo_usuario" VARCHAR(10) NOT NULL,
    "correo_electronico" VARCHAR(255) NOT NULL,
    "tipo_autenticacion" VARCHAR(20) NOT NULL,
    "password_hash" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "intentos_fallidos" INTEGER NOT NULL DEFAULT 0,
    "fecha_bloqueo" TIMESTAMP(3),
    "creado_por" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_por" INTEGER,
    "fecha_modificacion" TIMESTAMP(3),
    "fecha_ultimo_login" TIMESTAMP(3),

    CONSTRAINT "PK_Usuarios" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "UsuariosPrestadores" (
    "usuario_id" INTEGER NOT NULL,
    "prestador_id" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asignado_por" INTEGER,

    CONSTRAINT "PK_UsuariosPrestadores" PRIMARY KEY ("usuario_id","prestador_id")
);

-- CreateTable
CREATE TABLE "UsuariosRegiones" (
    "usuario_id" INTEGER NOT NULL,
    "region_id" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asignado_por" INTEGER,

    CONSTRAINT "PK_UsuariosRegiones" PRIMARY KEY ("usuario_id","region_id")
);

-- CreateTable
CREATE TABLE "UsuariosRoles" (
    "usuario_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asignado_por" INTEGER,

    CONSTRAINT "PK_UsuariosRoles" PRIMARY KEY ("usuario_id","rol_id")
);

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_tableName_recordId_idx" ON "AuditLog"("tableName", "recordId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Comunas_Codigo" ON "Comunas"("codigo");

-- CreateIndex
CREATE INDEX "IX_Notificaciones_Usuario" ON "Notificaciones"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ__Password__CA90DA7AC4201756" ON "PasswordResetTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Permisos_Codigo" ON "Permisos"("codigo");

-- CreateIndex
CREATE INDEX "IX_Permisos_Modulo" ON "Permisos"("modulo");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Prestadores_Rut" ON "Prestadores"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Provincias_Codigo" ON "Provincias"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "UK_RefreshTokens_token" ON "RefreshTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Regiones_Codigo" ON "Regiones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Regiones_Nombre" ON "Regiones"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Roles_Codigo" ON "Roles"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Roles_Nombre" ON "Roles"("nombre");

-- CreateIndex
CREATE INDEX "IX_RolesPermisos_Permiso" ON "RolesPermisos"("permiso_id");

-- CreateIndex
CREATE INDEX "IX_RolesPermisos_Rol" ON "RolesPermisos"("rol_id");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Usuarios_Rut" ON "Usuarios"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "UK_Usuarios_Correo" ON "Usuarios"("correo_electronico");

-- CreateIndex
CREATE INDEX "IX_UsuariosPrestadores_Prestador" ON "UsuariosPrestadores"("prestador_id");

-- CreateIndex
CREATE INDEX "IX_UsuariosPrestadores_Usuario" ON "UsuariosPrestadores"("usuario_id");

-- CreateIndex
CREATE INDEX "IX_UsuariosRegiones_Region" ON "UsuariosRegiones"("region_id");

-- CreateIndex
CREATE INDEX "IX_UsuariosRegiones_Usuario" ON "UsuariosRegiones"("usuario_id");

-- CreateIndex
CREATE INDEX "IX_UsuariosRoles_Rol" ON "UsuariosRoles"("rol_id");

-- CreateIndex
CREATE INDEX "IX_UsuariosRoles_Usuario" ON "UsuariosRoles"("usuario_id");

-- AddForeignKey
ALTER TABLE "AuditoriaAccesos" ADD CONSTRAINT "FK_AuditoriaAccesos_Usuarios" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Comunas" ADD CONSTRAINT "FK_Comunas_Creador" FOREIGN KEY ("creado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Comunas" ADD CONSTRAINT "FK_Comunas_Modificador" FOREIGN KEY ("modificado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Comunas" ADD CONSTRAINT "FK_Comunas_Provincias" FOREIGN KEY ("provincia_id") REFERENCES "Provincias"("provincia_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "FK_Notificaciones_Usuarios" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PasswordResetTokens" ADD CONSTRAINT "FK_PasswordResetTokens_Usuarios" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Permisos" ADD CONSTRAINT "FK_Permisos_Creador" FOREIGN KEY ("creado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Permisos" ADD CONSTRAINT "FK_Permisos_Modificador" FOREIGN KEY ("modificado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Prestadores" ADD CONSTRAINT "FK_Prestadores_Comuna" FOREIGN KEY ("comuna_id") REFERENCES "Comunas"("comuna_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Prestadores" ADD CONSTRAINT "FK_Prestadores_Creador" FOREIGN KEY ("creado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Prestadores" ADD CONSTRAINT "FK_Prestadores_Modificador" FOREIGN KEY ("modificado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Provincias" ADD CONSTRAINT "FK_Provincias_Creador" FOREIGN KEY ("creado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Provincias" ADD CONSTRAINT "FK_Provincias_Modificador" FOREIGN KEY ("modificado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Provincias" ADD CONSTRAINT "FK_Provincias_Regiones" FOREIGN KEY ("region_id") REFERENCES "Regiones"("region_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "FK_RefreshTokens_Usuarios" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Regiones" ADD CONSTRAINT "FK_Regiones_Creador" FOREIGN KEY ("creado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Regiones" ADD CONSTRAINT "FK_Regiones_Modificador" FOREIGN KEY ("modificado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "FK_Roles_Creador" FOREIGN KEY ("creado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "FK_Roles_Modificador" FOREIGN KEY ("modificado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RolesPermisos" ADD CONSTRAINT "FK_RolesPermisos_Permisos" FOREIGN KEY ("permiso_id") REFERENCES "Permisos"("permiso_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RolesPermisos" ADD CONSTRAINT "FK_RolesPermisos_Roles" FOREIGN KEY ("rol_id") REFERENCES "Roles"("rol_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_Usuarios_Creador" FOREIGN KEY ("creado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_Usuarios_Modificador" FOREIGN KEY ("modificado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosPrestadores" ADD CONSTRAINT "FK_UsuariosPrestadores_Asignador" FOREIGN KEY ("asignado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosPrestadores" ADD CONSTRAINT "FK_UsuariosPrestadores_Prestadores" FOREIGN KEY ("prestador_id") REFERENCES "Prestadores"("prestador_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosPrestadores" ADD CONSTRAINT "FK_UsuariosPrestadores_Usuarios" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosRegiones" ADD CONSTRAINT "FK_UsuariosRegiones_Asignador" FOREIGN KEY ("asignado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosRegiones" ADD CONSTRAINT "FK_UsuariosRegiones_Regiones" FOREIGN KEY ("region_id") REFERENCES "Regiones"("region_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosRegiones" ADD CONSTRAINT "FK_UsuariosRegiones_Usuarios" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosRoles" ADD CONSTRAINT "FK_UsuariosRoles_Asignador" FOREIGN KEY ("asignado_por") REFERENCES "Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosRoles" ADD CONSTRAINT "FK_UsuariosRoles_Roles" FOREIGN KEY ("rol_id") REFERENCES "Roles"("rol_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosRoles" ADD CONSTRAINT "FK_UsuariosRoles_Usuarios" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE NO ACTION;

