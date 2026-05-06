import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity'; 
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto, reqUser: any) {
    // 1. Шукаємо товари
    const products = await this.productRepository.findBy({
      id: In(createOrderDto.productIds),
    });
    
    if (products.length === 0) {
      throw new NotFoundException('Товари не знайдено');
    }

    const userId = reqUser.id || reqUser.sub;

    const fullUser = await this.orderRepository.manager.findOne(User, {
      where: { id: userId },
    });

    if (!fullUser) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const order = this.orderRepository.create({
      user: fullUser, 
      items: products,
      status: 'pending',
    });

    return this.orderRepository.save(order);
  }

  async findAll() {
    return this.orderRepository.find({ relations: ['items', 'user'] });
  }
}