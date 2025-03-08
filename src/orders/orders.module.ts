import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersAdminController } from './controllers/orders-admin.controller';
import { OrdersAppController } from './controllers/orders-app.controller';
import { OrderService } from './services/order.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './repositories/order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrdersAdminController, OrdersAppController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrdersModule {}
