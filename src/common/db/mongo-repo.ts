import { Injectable } from '@nestjs/common';
import { Document, FilterQuery, Model, QueryOptions } from 'mongoose';

import {
  MongoDbFindOneOptions,
  MongoDbFindOptions,
  PaginatedResult,
} from './definitions';

@Injectable()
export abstract class MongoRepo<Entity extends Document> {
  constructor(protected readonly model: Model<Entity>) {}

  async find(
    query: FilterQuery<Entity>,
    options?: QueryOptions,
  ): Promise<Entity[]> {
    return this.model.find(query, null, options);
  }

  async findById(id: string, options?: QueryOptions): Promise<Entity> {
    return this.model.findById(
      id,
      {
        password: 0,
      },
      options,
    );
  }

  async findOne(
    query: FilterQuery<Entity>,
    options?: MongoDbFindOneOptions,
  ): Promise<Entity> {
    return this.model.findOne(query, undefined, options);
  }

  async findAndPaginate(
    options: MongoDbFindOptions<FilterQuery<Entity>>,
  ): Promise<PaginatedResult<any>> {
    return this.model['findPaginated'](options);
  }

  findOneWithDeleted(query: FilterQuery<Entity>): Promise<Entity> {
    return this.model['findOneWithDeleted'](query).lean();
  }

  async countDocuments(query: FilterQuery<Entity>): Promise<number> {
    return this.model.countDocuments(query);
  }

  async exists(query: FilterQuery<Entity>): Promise<boolean> {
    const result = await this.model.exists(query);
    return !!result;
  }
}
