import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({ example: 'uuid-token-string', description: 'Refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
