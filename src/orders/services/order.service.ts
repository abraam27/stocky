import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { OrderRepository } from '../repositories/order.repository';
import { isAdmin, isStoreItem } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { Order } from '../schemas/order.schema';
import { User } from 'src/users/dtos/user.dto';
import {
  CreateOrderDto,
  GetOrdersDto,
  OrderStatus,
  PaymentMethod,
  UpdateOrderDto,
} from '../dtos/order.dto';
import { StoreService } from 'src/stores/services/store.service';
@Injectable()
export class OrderService {
  constructor(
    private readonly OrderRepository: OrderRepository,
    private readonly storeService: StoreService,
  ) {}

  async getOrders(options: MongoDbFindOptions<GetOrdersDto>) {
    const query: FilterQuery<Order> = {};

    if (options.filter?._id) {
      query._id = new Types.ObjectId(options.filter?._id);
    }

    if (options.filter?.status) {
      query.status = options.filter?.status;
    }

    if (options.filter?.customer_id) {
      query.customer_id = options.filter?.customer_id;
    }

    if (options.filter?.user_id) {
      query.user_id = options.filter?.user_id;
    }

    if (options.filter?.store_id) {
      query.store_id = options.filter?.store_id;
    }

    return this.OrderRepository.findAndPaginate({
      ...options?.filter,
      ...options,
      filter: query,
    });
  }

  async getOrderById(orderId: string) {
    const order = await this.OrderRepository.findById(orderId);
    if (!order)
      throw new NotFoundException(`order with ID ${orderId} not found`);
    return order;
  }

  async createOrder(dto: CreateOrderDto, user: User) {
    const _isAdmin = isAdmin(user);
    if (!_isAdmin) throw new AuthorizationError('Action not allowed');
    const calculateOrderTotals = this.calculateOrderTotals(dto);
    const order = await this.OrderRepository.createOrder({
      ...dto,
      ...calculateOrderTotals,
      user_id: user._id,
    });
    // await this.storeService.addTransaction(dto.store_id, {
    //   id: uuid(),
    //   type: TransactionType.Deposit,
    //   amount: calculateOrderTotals.total,
    //   reason: `Order No ${order._id} created`,
    //   timestamp: new Date(),
    // }, user);
    return order;
  }

  async updateOrder(orderId: string, dto: UpdateOrderDto, user: User) {
    const order = await this.OrderRepository.findById(orderId);
    if (!order)
      throw new NotFoundException(`Order with ID ${orderId} not found`);

    if (!isStoreItem(order, user))
      throw new AuthorizationError('Action not allowed');
    return await this.OrderRepository.updateOrderById(order._id, dto);
  }

  async deleteOrder(orderId: string, user: User) {
    const order = await this.OrderRepository.findById(orderId);
    if (!order)
      throw new NotFoundException(`Order with ID ${orderId} not found`);

    if (!isStoreItem(order, user))
      throw new AuthorizationError('Action not allowed');

    await this.OrderRepository.deleteOrderById(order._id);
    // await this.storeService.addTransaction(order.store_id, {
    //   id: uuid(),
    //   type: TransactionType.Withdraw,
    //   amount: order.total,
    //   reason: `Order No ${order._id} deleted`,
    //   timestamp: new Date(),
    // }, user);
    return { _id: order._id };
  }

  private calculateOrderTotals(order: Partial<Order>) {
    // Calculate subtotal
    order.subtotal = order.products.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0,
    );

    // Calculate total after applying discount
    order.total =
      order.subtotal -
      (order.subtotal * order.discount) / 100 -
      order.discount_value;

    return order;
  }
}
