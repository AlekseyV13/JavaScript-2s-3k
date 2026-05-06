import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepository.create({
      title: dto.title,
      price: dto.price,
      category: { id: dto.categoryId } as any,
    });
    return this.productRepository.save(product);
  }

  async findAll(filterDto: GetProductsFilterDto) {
    const { search, minPrice, maxPrice, page = 1, limit = 10 } = filterDto;
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (search) {
      query.andWhere('LOWER(product.title) LIKE LOWER(:search)', { search: `%${search}%` });
    }
    if (minPrice) query.andWhere('product.price >= :minPrice', { minPrice });
    if (maxPrice) query.andWhere('product.price <= :maxPrice', { maxPrice });

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);
    const [data, total] = await query.getManyAndCount();

    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] });
    if (!product) throw new NotFoundException(`Товар з ID ${id} не знайдено`);
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (dto.categoryId) product.category = { id: dto.categoryId } as any;
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async updateImage(id: number, imagePath: string) {
    const product = await this.findOne(id);
    product.image = imagePath;
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }
}