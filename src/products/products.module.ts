import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsAdminController } from './controllers/products.controller';
import { ProductService } from './services/product.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsAdminController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductsModule {}
