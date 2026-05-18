import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../common/enums/order-status.enum';

export class OrderQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Номер сторінки' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Кількість замовлень на сторінці' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiPropertyOptional({ enum: OrderStatus, description: 'Фільтр за статусом замовлення' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}