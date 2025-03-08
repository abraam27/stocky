import { BadRequestException } from '@nestjs/common';
import { FilterQuery, Schema } from 'mongoose';

import {
  FindPaginatedResult,
  MongoDbFindOneOptions,
  MongoDbFindOptions,
} from '../definitions';

function parseSort(sortStr: string): Record<string, 1 | -1> {
  let sort = {};

  if (sortStr) {
    const spliced = sortStr.split(':');
    if (spliced.length == 2) {
      sort = { [spliced[0]]: Number(spliced[1]) };
    }
  }
  return sort;
}

export function MongoosePlugin(schema: Schema) {
  /**
   * add pagination functionality
   */
  schema.statics.findPaginated = async function <T>(
    params: MongoDbFindOptions<T>,
  ): Promise<FindPaginatedResult<T>> {
    const query = params.filter || {};
    const sort = params.sort
      ? typeof params.sort === 'string'
        ? parseSort(params.sort)
        : params.sort
      : {};
    const select = params.select || {};

    const paginationData = {
      total: 0,
      current_page: 1,
      to: 1,
      per_page: +params.limit || 0,
    };
    let skip = 0;

    if (params.pagination !== false) {
      // when pagination enabled
      paginationData.per_page = paginationData.per_page || 20;
      if (paginationData.per_page > 200) {
        paginationData.per_page = 200;
      }
      paginationData.current_page = params.page || 1;
      paginationData.total = await this.find(query).countDocuments();

      skip = (paginationData.current_page - 1) * paginationData.per_page;
      paginationData.per_page = paginationData.per_page || 15;
      paginationData.to = skip + paginationData.per_page;
      if (paginationData.to > paginationData.total)
        paginationData.to = paginationData.total;
    }

    let mongoQuery = this.find(query).sort(sort).select(select);
    if (params.populate && params.populate.length) {
      for (const p of params.populate) {
        mongoQuery = mongoQuery.populate(p.path, p.select);
      }
    }

    const data = await mongoQuery
      .skip(skip)
      .limit(paginationData.per_page)
      .lean({ virtuals: true });

    if (params.pagination === false) {
      paginationData.total = data.length;
      paginationData.per_page = data.length;
    }

    return { pagination: paginationData, data };
  };

  /**
   * update by specific field
   * @param field
   * @param value
   * @param data
   * @returns
   */
  schema.statics.updateOneBy = function (field: string, value: any, data: any) {
    if (!value)
      throw new BadRequestException({ message: `${field} value not provided` });
    return this.updateOne({ [field]: value }, data).exec();
  };

  /**
   * check the existence and ignore some ids
   * @param query
   * @param excludedIds
   * @returns
   */
  schema.statics.isExists = async function (
    query: Record<string, any>,
    excludedIds: any[],
  ) {
    if (excludedIds && excludedIds.length) {
      query['_id'] = { $nin: excludedIds };
    }
    const count = await this.countDocuments(query);
    return count > 0;
  };

  /**
   * find one document by specific field
   * @param field
   * @param value
   * @param options
   * @returns
   */
  schema.statics.findOneBy = function (
    filter: FilterQuery<unknown>,
    options?: MongoDbFindOneOptions,
  ) {
    if (!filter) return null;
    let query = this.findOne({ ...filter });

    if (options) {
      if (options.select) {
        query = query.select(options.select);
      }
      if (options.populate && options.populate.length) {
        for (const p of options.populate) {
          query = query.populate(p.path, p.select);
        }
      }
    }
    return query.lean({ virtuals: true });
  };
}
