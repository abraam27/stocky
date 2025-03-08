import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersAdminController } from './controllers/orders.controller';
import { OrderService } from './services/order.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './repositories/order.repository';
import { StoresModule } from 'src/stores/stores.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    StoresModule,
  ],
  controllers: [OrdersAdminController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrdersModule {}
