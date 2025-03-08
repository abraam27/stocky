import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { StoreRepository } from '../repositories/store.repository';
import { Store } from '../schemas/store.schema';
import { User } from 'src/users/dtos/user.dto';
import { CreateStoreDto, UpdateStoreDto } from '../dtos/store.dto';
@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async getPartners(options: MongoDbFindOptions<any>) {
    const query: FilterQuery<Store> = {};

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

    return this.storeRepository.findAndPaginate({
      ...options?.filter,
      ...options,
      filter: query,
    });
  }

  async getPartnerById(partnerId: string) {
    const partner = await this.storeRepository.findById(partnerId);
    if (!partner)
      throw new NotFoundException(`Partner with ID ${partnerId} not found`);
    return partner;
  }

  async createUser(dto: CreateStoreDto, user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    return await this.storeRepository.createStore(dto);
  }

  async updateUser(storeId: string, dto: UpdateStoreDto, user: User) {
    const _user = await this.storeRepository.findById(storeId);
    if (!_user)
      throw new NotFoundException(`User with ID ${storeId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    return await this.storeRepository.updateStoreById(_user._id, dto);
  }

  async deleteUser(storeId: string, user: User) {
    const _user = await this.storeRepository.findById(storeId);
    if (!_user)
      throw new NotFoundException(`User with ID ${storeId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    await this.storeRepository.deleteStoreById(_user._id);
    return { _id: _user._id };
  }

  async authenticate(token: string) {
    return token;
  }
}
