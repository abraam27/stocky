import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LoggedUser } from 'src/common/decorators/genwin';
import { OrderService } from '../services/order.service';
import { User } from 'src/users/dtos/user.dto';
import { isAdmin, isStoreItem } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';

@Controller('api/orders')
export class OrdersAdminController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getOrders(@Query() query: any, @LoggedUser() user: User) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.orderService.getOrders(options);
  }

  @Get(':order_id')
  async getOrderById(
    @Param('order_id') orderId: string,
    @LoggedUser() user: User,
  ) {
    const order = await this.orderService.getOrderById(orderId);
    const _isAdmin = isStoreItem(order, user);
    if (!_isAdmin) throw new AuthorizationError('Action not allowed');
    return order;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.orderService.createOrder(body, user);
  }

  @Put(':order_id')
  async updateOrder(
    @Param('order_id') orderId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.orderService.updateOrder(orderId, body, user);
  }

  @Delete(':order_id')
  async deleteOrder(
    @Param('order_id') orderId: string,
    @LoggedUser() user: User,
  ) {
    return await this.orderService.deleteOrder(orderId, user);
  }
}
