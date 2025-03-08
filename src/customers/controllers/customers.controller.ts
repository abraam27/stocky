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
import { User } from 'src/users/dtos/user.dto';
import { CustomerService } from '../services/customer.service';

@Controller('api/customers')
export class CustomersAdminController {
  constructor(private customerService: CustomerService) {}

  @Get()
  async getCustomers(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.customerService.getCustomers(options);
  }

  @Get(':customer_id')
  async getCustomerById(@Param('customer_id') customerId: string) {
    const customer = await this.customerService.getCustomerById(customerId);
    // const isAdmin = isItemAdmin(Customer, user);
    // if (!isAdmin) throw new AuthorizationError('Action not allowed');
    return customer;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.customerService.createCustomer(body, user);
  }

  @Put(':customer_id')
  async updateCustomer(
    @Param('customer_id') customerId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.customerService.updateCustomer(customerId, body, user);
  }

  @Delete(':customer_id')
  async deleteCustomer(
    @Param('customer_id') customerId: string,
    @LoggedUser() user: User,
  ) {
    return await this.customerService.deleteCustomer(customerId, user);
  }
}
