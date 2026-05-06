import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ 
    example: 'Автозапчастини', 
    description: 'Назва категорії' 
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ 
    example: 'Витратні матеріали для ТО', 
    description: 'Опис категорії (необовʼязково)' 
  })
  @IsOptional()
  @IsString()
  description?: string;
}