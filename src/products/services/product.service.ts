import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { ProductRepository } from '../repositories/product.repository';
import { isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { Product } from '../schemas/product.schema';
import { User } from 'src/users/dtos/user.dto';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
@Injectable()
export class ProductService {
  constructor(private readonly ProductRepository: ProductRepository) {}

  async getProducts(options: MongoDbFindOptions<any>) {
    const query: FilterQuery<Product> = {};

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

    return this.ProductRepository.findAndPaginate({
      ...options?.filter,
      ...options,
      filter: query,
    });
  }

  async getProductById(ProductId: string) {
    const partner = await this.ProductRepository.findById(ProductId);
    if (!partner)
      throw new NotFoundException(`Partner with ID ${ProductId} not found`);
    return partner;
  }

  async createProduct(dto: CreateProductDto, user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    return await this.ProductRepository.createProduct(dto);
  }

  async updateProduct(ProductId: string, dto: UpdateProductDto, user: User) {
    const _Product = await this.ProductRepository.findById(ProductId);
    if (!_Product)
      throw new NotFoundException(`Product with ID ${ProductId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    return await this.ProductRepository.updateProductById(_Product._id, dto);
  }

  async deleteProduct(ProductId: string, user: User) {
    const _Product = await this.ProductRepository.findById(ProductId);
    if (!_Product)
      throw new NotFoundException(`Product with ID ${ProductId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    await this.ProductRepository.deleteProductById(_Product._id);
    return { _id: _Product._id };
  }

  async authenticate(token: string) {
    return token;
  }
}
