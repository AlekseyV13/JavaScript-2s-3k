import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Назва категорії обовʼязкова' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}