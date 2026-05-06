import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: [1, 2], description: 'Масив ID товарів' })
  @IsArray()
  @IsNumber({}, { each: true })
  productIds: number[];
}