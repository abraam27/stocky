import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductService } from './product.service';
import { Product, ProductSchema } from './product.schema';
import { ProductRepository } from './product.repository';
import { ProductsAdminController } from './products.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsAdminController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductsModule {}
