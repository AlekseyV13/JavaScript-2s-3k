import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ 
    example: 'Свічки запалювання Lancer X', 
    description: 'Назва товару' 
  })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({ 
    example: 1200, 
    description: 'Ціна товару' 
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ 
    example: 10, 
    description: 'Кількість на складі' 
  })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID категорії' 
  })
  @IsNumber()
  categoryId: number;
}