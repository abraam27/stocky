import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { isAdmin, isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { Product } from './product.schema';
import { User } from 'src/users/user.dto';
import { AssignProductVariantsDto, ConfirmProductVariantsDto, CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductRepository } from './product.repository';
import { ProductVariant } from './product-variant.schema';
@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) { }
  private readonly logger = new Logger(ProductService.name); // Initialize logger

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

    return this.productRepository.findAndPaginate({
      ...options?.filter,
      ...options,
      filter: query,
    });
  }

  async getProductById(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);
    return product;
  }

  async getProductVariantId(variantId: string) {
    const product = await this.productRepository.findOne({ "product_variant._id": variantId });
    if (!product)
      throw new NotFoundException(`Product with ID ${variantId} not found`);
    return product;
  }

  async createProduct(dto: CreateProductDto, user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    dto.product_variant = dto.product_variant.map((variant) => ({
      ...variant,
      saved_by: user._id,
    }));
    return await this.productRepository.createProduct(dto);
  }

  async updateProduct(productId: string, dto: UpdateProductDto, user: User) {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    return await this.productRepository.updateProductById(product._id, dto);
  }

  async deleteProduct(productId: string, user: User) {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    await this.productRepository.deleteProductById(product._id);
    return { _id: product._id };
  }

  async assignProducts(assignProductVariantsDto: AssignProductVariantsDto, user: User): Promise<number> {
    const _isOwner = isOwner(user);
    if (!_isOwner) {
      throw new AuthorizationError('Action not allowed');
    }

    const { product_variants } = assignProductVariantsDto;
    let assignedCount = 0;

    for (const { product_id, variant_id, store_id, quantity } of product_variants) {
      const product = await this.productRepository.findById(product_id);

      if (!product) {
        throw new Error(`Product with ID ${product_id} not found`);
      }

      product.product_variant.forEach((variant: ProductVariant & { _id: string }) => {
        if (variant.sku < quantity) {
          throw new Error(`The stock has fewer products than the quantity assigned to the store`);
        }

        if (variant_id.includes(variant._id.toString())) {
          const existingStore = variant.quantity.find((item) => item.store_id === store_id);

          if (existingStore) {
            existingStore.quantity += quantity;
          } else {
            variant.quantity.push({
              store_id,
              quantity,
              confirmed_by: null
            });
          }

          variant.sku -= quantity;
          assignedCount++;
        }
      });

      await product.save();
    }
    return assignedCount;
  }

  // validate store id == admin manager
  async confirmProducts(confirmProductVariantsDto: ConfirmProductVariantsDto, user: User): Promise<number> {
    const { product_variants } = confirmProductVariantsDto;
    let confirmedCount = 0;

    for (const { product_id, variant_id } of product_variants) {
      const product = await this.productRepository.findById(product_id);

      if (!product) {
        throw new Error(`Product with ID ${product_id} not found`);
      }

      product.product_variant.forEach((variant: ProductVariant & { _id: string }) => {
        if (variant_id.includes(variant._id.toString())) {
          variant.quantity.forEach((quantity) => {
            if (quantity.store_id.includes(user.store_id.toString())) {
              quantity.confirmed_by = user._id.toString()
              confirmedCount++;
            }
          })
        }
      });

      await product.save();
    }

    return confirmedCount;
  }
}
