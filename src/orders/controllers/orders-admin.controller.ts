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

@Controller('admin-api/orders')
export class OrdersAdminController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getPartners(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.orderService.getOrders(options);
  }

  @Get(':order_id')
  async getPartnerById(@Param('order_id') orderId: string) {
    const partner = await this.orderService.getOrderById(orderId);
    // const isAdmin = isItemAdmin(partner, user);
    // if (!isAdmin) throw new AuthorizationError('Action not allowed');
    return partner;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.orderService.createOrder(body, user);
  }

  @Put(':order_id')
  async updatePartner(
    @Param('order_id') orderId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.orderService.updateOrder(orderId, body, user);
  }

  @Delete(':order_id')
  async deletePartner(
    @Param('order_id') orderId: string,
    @LoggedUser() user: User,
  ) {
    return await this.orderService.deleteOrder(orderId, user);
  }
}
