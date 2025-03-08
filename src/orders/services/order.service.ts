import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { OrderRepository } from '../repositories/order.repository';
import { isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { Order } from '../schemas/order.schema';
import { User } from 'src/users/dtos/user.dto';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
@Injectable()
export class OrderService {
  constructor(private readonly OrderRepository: OrderRepository) {}

  async getOrders(options: MongoDbFindOptions<any>) {
    const query: FilterQuery<Order> = {};

    if (options.filter?._id) {
      query._id = new Types.ObjectId(options.filter?._id);
    }

    if (options.filter?.name) {
      query.name = options.filter?.name;
    }

    if (options.filter?.alias) {
      query.alias = options.filter?.alias;
    }

    if (options.filter?.organization_id) {
      query.organization_id = options.filter?.organization_id;
    }

    if (options.filter?.fund_raiser_id) {
      query.fund_raiser_id = { $in: [options.filter?.fund_raiser_id, null] };
    }

    if (options.filter?.plaid_id) {
      query['plaid.id'] = options.filter?.plaid_id;
    }

    if (options?.filter?.key) {
      query.$or = [{ name: { $regex: options.filter.key, $options: 'i' } }];
    }

    return this.OrderRepository.findAndPaginate({
      ...options?.filter,
      ...options,
      filter: query,
    });
  }

  async getOrderById(orderId: string) {
    const partner = await this.OrderRepository.findById(orderId);
    if (!partner)
      throw new NotFoundException(`Partner with ID ${orderId} not found`);
    return partner;
  }

  async createOrder(dto: CreateOrderDto, user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    return await this.OrderRepository.createOrder(dto);
  }

  async updateOrder(OrderId: string, dto: UpdateOrderDto, user: User) {
    const _Order = await this.OrderRepository.findById(OrderId);
    if (!_Order)
      throw new NotFoundException(`Order with ID ${OrderId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    return await this.OrderRepository.updateOrderById(_Order._id, dto);
  }

  async deleteOrder(OrderId: string, user: User) {
    const _Order = await this.OrderRepository.findById(OrderId);
    if (!_Order)
      throw new NotFoundException(`Order with ID ${OrderId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    await this.OrderRepository.deleteOrderById(_Order._id);
    return { _id: _Order._id };
  }

  async authenticate(token: string) {
    return token;
  }
}
