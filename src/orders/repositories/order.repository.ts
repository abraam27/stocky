import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoRepo } from 'src/common/db';
import { slugify } from 'src/common/utils';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrderRepository extends MongoRepo<OrderDocument> {
  constructor(@InjectModel(Order.name) model: Model<OrderDocument>) {
    super(model);
  }

  async generateAlias(title: string, exclude?: { _id: unknown }) {
    const alias = slugify(title);
    const query = !!exclude?._id
      ? { _id: { $ne: new Types.ObjectId(exclude._id.toString()) } }
      : {};
    let count = await this.model.countDocuments({
      alias: { $regex: new RegExp(`^${alias}`) },
      ...query,
    });

    if (count === 0) return alias;
    let uniqueAlias = alias;

    while ((await this.countDocuments({ alias: uniqueAlias, ...query })) > 0) {
      count++;
      uniqueAlias = alias + '-' + count;
    }
    return uniqueAlias;
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
