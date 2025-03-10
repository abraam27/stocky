import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoRepo } from 'src/common/db';
import { slugify } from 'src/common/utils';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrderRepository extends MongoRepo<OrderDocument> {
  constructor(@InjectModel(Order.name) model: Model<OrderDocument>) {
    super(model);
  }
  async createOrder(data: Partial<Order>) {
    const [order] = await this.model.create([data]);
    return order.toObject();
  }

  async updateOrderById(_id: Types.ObjectId | string, data: Partial<Order>) {
    const order = await this.model.findOneAndUpdate({ _id }, data, {
      new: true,
    });
    if (!order) return null;
    return order.toObject();
  }

  async deleteOrderById(_id: Types.ObjectId | string) {
    const order = await this.model.findOneAndDelete({ _id });
    if (!order) return null;
    return order.toObject();
  }
}
