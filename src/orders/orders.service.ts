import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/product.entity';
import { OrderStatus } from '../common/enums/order-status.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  private getCleanUserId(rawUserId: any): number {
    try {
      const parsed = typeof rawUserId === 'string' && rawUserId.startsWith('{')
        ? JSON.parse(rawUserId)
        : rawUserId;
      return Number(parsed?.userId || parsed?.id || parsed?.sub || parsed);
    } catch {
      return Number(rawUserId);
    }
  }

  async create(dto: CreateOrderDto, rawUserId: any): Promise<any> {
    const cleanUserId = this.getCleanUserId(rawUserId);
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const item of dto.items) {
        const product = await qr.manager.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new NotFoundException(`Product #${item.productId} not found`);
        if (product.stock < item.quantity) throw new BadRequestException(`Insufficient stock for product #${item.productId}`);

        const newStock = product.stock - item.quantity;
        await qr.manager.update(Product, product.id, { stock: newStock });

        const orderItem = new OrderItem();
        orderItem.product = { id: product.id } as any;
        orderItem.quantity = item.quantity;
        orderItem.price = Number(product.price);

        orderItems.push(orderItem);
        totalPrice += Number(product.price) * item.quantity;
      }

      const order = new Order();
      order.user = { id: cleanUserId } as any;
      order.totalPrice = totalPrice;
      order.status = OrderStatus.PENDING;
      order.items = orderItems;

      const savedOrder = await qr.manager.save(Order, order);
      await qr.commitTransaction();

      try {
        const keys: string[] = await (this.cacheManager as any).store.keys('products:*');
        if (keys.length > 0) await Promise.all(keys.map((k) => this.cacheManager.del(k)));
      } catch (e) { }

      return {
        id: savedOrder.id,
        totalPrice: savedOrder.totalPrice,
        status: savedOrder.status,
        items: savedOrder.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          productId: item.product.id
        }))
      };
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async findAll(query: OrderQueryDto, rawUserId: any, userRole: string) {
    const cleanUserId = this.getCleanUserId(rawUserId);
    const { page = 1, pageSize = 10, status } = query;

    const qb = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('order.user', 'user');

    if (userRole !== 'admin') {
      qb.andWhere('user.id = :uid', { uid: cleanUserId });
    }
    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    qb.orderBy('order.createdAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);
    const [orders, total] = await qb.getManyAndCount();

    const flatOrders = orders.map(order => ({
      id: order.id,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items?.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: item.product ? { id: item.product.id, title: item.product.title } : null
      }))
    }));

    return { items: flatOrders, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findOne(id: number, rawUserId: any, userRole: string): Promise<any> {
    const cleanUserId = this.getCleanUserId(rawUserId);

    const order = await this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.id = :id', { id })
      .getOne();

    if (!order) throw new NotFoundException(`Order #${id} not found`);
    if (userRole !== 'admin' && order.user.id !== cleanUserId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return {
      id: order.id,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items?.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: item.product ? { id: item.product.id, title: item.product.title } : null
      }))
    };
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<any> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const order = await qr.manager.createQueryBuilder(Order, 'order')
        .leftJoinAndSelect('order.items', 'item')
        .leftJoinAndSelect('item.product', 'product')
        .where('order.id = :id', { id })
        .getOne();

      if (!order) throw new NotFoundException(`Order #${id} not found`);

      const current = order.status;
      const next = dto.status;
      const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
        [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
        [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
      };

      if (!allowedTransitions[current].includes(next)) throw new BadRequestException(`Cannot change status from ${current} to ${next}`);

      if (next === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          await qr.manager.update(Product, item.product.id, { stock: item.product.stock + item.quantity });
        }
        const keys: string[] = await (this.cacheManager as any).store.keys('products:*');
        if (keys.length > 0) await Promise.all(keys.map((k) => this.cacheManager.del(k)));
      }

      order.status = next;
      const saved = await qr.manager.save(order);
      await qr.commitTransaction();

      return {
        id: saved.id,
        totalPrice: saved.totalPrice,
        status: saved.status,
        items: saved.items?.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async remove(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    await this.orderRepo.remove(order);
    return { message: `Order #${id} successfully removed` };
  }
}