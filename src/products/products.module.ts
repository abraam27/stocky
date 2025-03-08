import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsAdminController } from './controllers/products-admin.controller';
import { ProductsAppController } from './controllers/products-app.controller';
import { ProductService } from './services/product.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsAdminController, ProductsAppController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductsModule {}
