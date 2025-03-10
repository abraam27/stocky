import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersAdminController } from './orders.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './order.schema';
import { StoresModule } from 'src/stores/stores.module';
import { OrderRepository } from './order.repository';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    StoresModule,
    ProductsModule
  ],
  controllers: [OrdersAdminController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrdersModule {}
