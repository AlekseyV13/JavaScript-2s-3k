import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'admin@test.com', description: 'Унікальна електронна пошта' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль (мінімум 8 символів)' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiPropertyOptional({ example: 'Олексій', description: 'Імʼя користувача' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}