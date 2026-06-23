import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  usuario_id: number;
  rut: string;
  nombres: string;
  primer_apellido: string;
  roles: string[];
  permisos: string[];
}

export const CurrentUser = createParamDecorator(
  (
    data: keyof AuthUser | undefined,
    ctx: ExecutionContext,
  ): AuthUser | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUser;
    return data ? user?.[data] : user;
  },
);
