import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  private async clearProductsCache(): Promise<void> {
    const keys: string[] = await (this.cacheManager as any).store.keys('products:*');
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => this.cacheManager.del(key)));
    }
  }

  async findAll(query: ProductQueryDto) {
    const cacheKey = `products:${JSON.stringify(query)}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const {
      page = 1,
      pageSize = 10,
      sort = 'id',
      order = 'desc',
      categoryId,
      minPrice,
      maxPrice,
      search,
    } = query;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (search) {
      qb.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`product.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');

    const skip = (page - 1) * pageSize;
    qb.skip(skip).take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    const result = {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    await this.cacheManager.set(cacheKey, result, 60_000);

    return result;
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepo.create({
      title: createProductDto.title,
      price: createProductDto.price,
      stock: createProductDto.stock,
      category: { id: createProductDto.categoryId },
    });
    const saved = await this.productRepo.save(product);

    await this.clearProductsCache();
    return saved;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.title) product.title = updateProductDto.title;
    if (updateProductDto.price) product.price = updateProductDto.price;
    if (updateProductDto.stock) product.stock = updateProductDto.stock;
    if (updateProductDto.categoryId) product.category = { id: updateProductDto.categoryId } as any;

    const saved = await this.productRepo.save(product);

    await this.clearProductsCache();
    return saved;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);

    await this.clearProductsCache();
  }
}