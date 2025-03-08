import { Controller, Get, Param, Query } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';

@Controller('app-api/partners')
export class CustomersAppController {
  constructor(private readonly customerService: CustomerService) {}
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
  async getCustomerById(@Param('customer_id') partnerId: string) {
    return await this.customerService.getCustomerById(partnerId);
  }
}
