export interface AuthUser {
  usuario_id: number;
  rut: string;
  nombres: string;
  primer_apellido: string;
  roles: string[];
  permisos: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Usuario {
  usuario_id: number;
  rut: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido?: string;
  tipo_usuario: string;
  correo_electronico: string;
  tipo_autenticacion: string;
  activo: boolean;
  bloqueado: boolean;
  intentos_fallidos: number;
  fecha_bloqueo?: string;
  creado_por?: number;
  fecha_creacion: string;
  modificado_por?: number;
  fecha_modificacion?: string;
  fecha_ultimo_login?: string;
}

export interface Rol {
  rol_id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  requiere_contexto: string;
  activo: boolean;
  creado_por?: number;
  fecha_creacion: string;
  modificado_por?: number;
  fecha_modificacion?: string;
}

export interface Permiso {
  permiso_id: number;
  codigo: string;
  modulo: string;
  accion: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface Region {
  region_id: number;
  codigo: string;
  nombre: string;
  abreviatura?: string;
  orden_visual?: number;
  activo: boolean;
  fecha_creacion: string;
}

export interface Provincia {
  provincia_id: number;
  nombre: string;
  region_id: number;
  activo: boolean;
  codigo: string;
  fecha_creacion: string;
  Comunas?: Comuna[];
  Regiones?: Region;
}

export interface Comuna {
  comuna_id: number;
  nombre: string;
  provincia_id: number;
  activo: boolean;
  codigo: string;
  fecha_creacion: string;
  Provincias?: Provincia;
}

export interface Prestador {
  prestador_id: number;
  rut: string;
  razon_social: string;
  direccion?: string;
  comuna_id?: number;
  telefono?: string;
  email?: string;
  activo: boolean;
  fecha_creacion: string;
  Comunas?: Comuna;
}

export interface Notificacion {
  notificacion_id: number;
  usuario_id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  metadata?: unknown;
  fecha_creacion: string;
}

export interface AuditoriaAcceso {
  log_id: string;
  usuario_id?: number;
  input_login?: string;
  fecha_evento: string;
  tipo_evento: string;
  direccion_ip?: string;
  user_agent?: string;
  detalle?: string;
}

export interface AuditLog {
  id: number;
  tableName: string;
  recordId: string;
  action: string;
  oldData?: unknown;
  newData?: unknown;
  userId?: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
