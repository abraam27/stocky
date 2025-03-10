import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoRepo } from 'src/common/db';
import { slugify } from 'src/common/utils';
import { Customer, CustomerDocument } from './customer.schema';

@Injectable()
export class CustomerRepository extends MongoRepo<CustomerDocument> {
  constructor(@InjectModel(Customer.name) model: Model<CustomerDocument>) {
    super(model);
  }
  async createCustomer(data: Partial<Customer>) {
      const [customer] = await this.model.create([data]);
      return customer.toObject();
  }

  async updateCustomerById(
    _id: Types.ObjectId | string,
    data: Partial<Customer>,
  ) {
      const customer = await this.model.findOneAndUpdate({ _id }, data, {
        new: true,
      });
      if (!customer) return null;
      return customer.toObject();
  }

  async deleteCustomerById(_id: Types.ObjectId | string) {
      const customer = await this.model.findOneAndDelete({ _id });
      if (!customer) return null;
      return customer.toObject();
  }
}
