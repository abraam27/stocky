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
    
    if (options.filter?._ids) {
      query._id = { $in: options.filter.ids.map(_id => new Types.ObjectId(_id)) };
    }

    if (options.filter?.name) {
      query.name = options.filter?.name;
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

  async getProductById(productId: string) {
    const product = await this.ProductRepository.findById(productId);
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);
    return product;
  }

  async createProduct(dto: CreateProductDto, user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    return await this.ProductRepository.createProduct({
      ...dto,
      saved_by: user._id.toString(),
    });
  }

  async updateProduct(productId: string, dto: UpdateProductDto, user: User) {
    const product = await this.ProductRepository.findById(productId);
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    return await this.ProductRepository.updateProductById(product._id, dto);
  }

  async deleteProduct(productId: string, user: User) {
    const product = await this.ProductRepository.findById(productId);
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    await this.ProductRepository.deleteProductById(product._id);
    return { _id: product._id };
  }
}
