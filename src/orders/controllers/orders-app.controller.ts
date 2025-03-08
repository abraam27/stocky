import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderService } from '../services/order.service';

@Controller('app-api/orders')
export class OrdersAppController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  async getOrders(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.orderService.getOrders(options);
  }

  @Get(':order_id')
  async getOrderById(@Param('order_id') partnerId: string) {
    return await this.orderService.getOrderById(partnerId);
  }
}
