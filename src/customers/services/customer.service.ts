import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { User } from 'src/users/dtos/user.dto';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { CustomerRepository } from '../repositories/customer.repository';
import { Customer } from '../schemas/customer.schema';
@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async getCustomers(options: MongoDbFindOptions<any>) {
    const query: FilterQuery<Customer> = {};

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

    return this.customerRepository.findAndPaginate({
      ...options?.filter,
      ...options,
      filter: query,
    });
  }

  async getCustomerById(customerId: string) {
    const partner = await this.customerRepository.findById(customerId);
    if (!partner)
      throw new NotFoundException(`Partner with ID ${customerId} not found`);
    return partner;
  }

  async createCustomer(dto: CreateCustomerDto, user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    return await this.customerRepository.createCustomer(dto);
  }

  async updateCustomer(customerId: string, dto: UpdateCustomerDto, user: User) {
    const _customer = await this.customerRepository.findById(customerId);
    if (!_customer)
      throw new NotFoundException(`customer with ID ${customerId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    return await this.customerRepository.updateCustomerById(_customer._id, dto);
  }

  async deleteCustomer(customerId: string, user: User) {
    const _customer = await this.customerRepository.findById(customerId);
    if (!_customer)
      throw new NotFoundException(`customer with ID ${customerId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    await this.customerRepository.deleteCustomerById(_customer._id);
    return { _id: _customer._id };
  }

  async authenticate(token: string) {
    return token;
  }
}
