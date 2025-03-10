import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoRepo } from 'src/common/db';
import { slugify } from 'src/common/utils';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductVariant } from './product-variant.schema';

@Injectable()
export class ProductRepository extends MongoRepo<ProductDocument> {
  constructor(@InjectModel(Product.name) model: Model<ProductDocument>) {
    super(model);
  }

  async generateAlias(title: string, exclude?: { _id: unknown }) {
    const alias = slugify(title);
    const query = !!exclude?._id
      ? { _id: { $ne: new Types.ObjectId(exclude._id.toString()) } }
      : {};
    let count = await this.model.countDocuments({
      alias: { $regex: new RegExp(`^${alias}`) },
      ...query,
    });

    if (count === 0) return alias;
    let uniqueAlias = alias;

    while ((await this.countDocuments({ alias: uniqueAlias, ...query })) > 0) {
      count++;
      uniqueAlias = alias + '-' + count;
    }
    return uniqueAlias;
  }

  async createProduct(data: CreateProductDto) {
    const [product] = await this.model.create([data]);
    return product.toObject();
  }

  async updateProductById(
    _id: Types.ObjectId | string,
    data: UpdateProductDto,
  ) {
    const product = await this.model.findOneAndUpdate({ _id }, data, {
      new: true,
    });
    if (!product) return null;
    return product.toObject();
  }

  async deleteProductById(_id: Types.ObjectId | string) {
    const product = await this.model.findOneAndDelete({ _id });
    if (!product) return null;
    return product.toObject();
  }
}
