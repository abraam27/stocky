import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomersAdminController } from './customers.controller';
import { CustomerService } from './customer.service';
import { Customer, CustomerSchema } from './customer.schema';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [CustomersAdminController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService],
})
export class CustomersModule {}
