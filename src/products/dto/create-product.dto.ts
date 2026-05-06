import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Свічки запалювання Lancer X' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}