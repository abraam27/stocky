import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { User } from 'src/users/user.dto';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';
import { CustomerRepository } from './customer.repository';
import { Customer } from './customer.schema';
@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) { }

  async getCustomers(options: MongoDbFindOptions<any>) {
    const query: FilterQuery<Customer> = {};

    if (options.filter?._id) {
      query._id = new Types.ObjectId(options.filter?._id);
    }

    if (options?.filter?.key) {
      query.$or = [{ name: { $regex: options.filter.key, $options: 'i' } }];
    }

    return this.customerRepository.findAndPaginate({
      ...options?.filter,
      ...options,
      filter: query,
    });
  }

  async getCustomerById(customerId: string) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer)
      throw new NotFoundException(`customer with ID ${customerId} not found`);
    return customer;
  }

  async createCustomer(dto: CreateCustomerDto, user: User) {
    if (!user)
      throw new NotFoundException(`Please login first`);
    return await this.customerRepository.createCustomer({ ...dto, saved_by: user._id });
  }

  async updateCustomer(customerId: string, dto: UpdateCustomerDto, user: User) {
    const _customer = await this.customerRepository.findById(customerId);
    if (!_customer)
      throw new NotFoundException(`customer with ID ${customerId} not found`);

    if (!user)
      throw new NotFoundException(`Please login first`);

    return await this.customerRepository.updateCustomerById(_customer._id, { ...dto, updated_by: user._id });
  }

  async deleteCustomer(customerId: string, user: User) {
    const _customer = await this.customerRepository.findById(customerId);
    if (!_customer)
      throw new NotFoundException(`customer with ID ${customerId} not found`);

    await this.customerRepository.deleteCustomerById(_customer._id);
    return { _id: _customer._id };
  }
}
