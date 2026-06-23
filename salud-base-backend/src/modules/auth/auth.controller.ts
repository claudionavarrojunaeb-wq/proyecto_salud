import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { Public, Roles } from '../../common/decorators/index.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesion' })
  async login(
    @Body() dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(dto.rut, dto.password);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token' })
  async refresh(
    @Body() dto: RefreshDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesion' })
  async logout(@Body() dto: RefreshDto): Promise<{ message: string }> {
    await this.authService.logout(dto.refreshToken);
    return { message: 'Sesion cerrada correctamente' };
  }

  @Post('register')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Registrar nuevo usuario (solo admin)' })
  async register(
    @Body() dto: RegisterDto,
  ): Promise<{ usuario_id: number; rut: string; correo_electronico: string }> {
    return this.authService.register(dto);
  }
}
