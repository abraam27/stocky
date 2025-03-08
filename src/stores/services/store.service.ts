import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { StoreRepository } from '../repositories/store.repository';
import { CreateStoreDto, UpdateStoreDto } from '../dtos/store.dto';
import { User } from 'src/users/dtos/user.dto';
import { Store } from '../schemas/store.schema';
@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async getStores(options: MongoDbFindOptions<any>) {
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

  async getStoreById(storeId: string) {
    const store = await this.storeRepository.findById(storeId);
    if (!store)
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    return store;
  }

  async createStore(dto: CreateStoreDto, user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    return await this.storeRepository.createStore(dto);
  }

  async updateStore(storeId: string, dto: UpdateStoreDto, user: User) {
    const store = await this.storeRepository.findById(storeId);
    if (!store)
      throw new NotFoundException(`Store with ID ${storeId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    return await this.storeRepository.updateStoreById(store._id, dto);
  }

  async deleteStore(storeId: string, user: User) {
    const store = await this.storeRepository.findById(storeId);
    if (!store)
      throw new NotFoundException(`Store with ID ${storeId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    await this.storeRepository.deleteStoreById(store._id);
    return { _id: store._id };
  }
}
