import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomersAdminController } from './controllers/customers-admin.controller';
import { CustomersAppController } from './controllers/customers-app.controller';
import { CustomerService } from './services/customer.service';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { CustomerRepository } from './repositories/customer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [CustomersAdminController, CustomersAppController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService],
})
export class CustomersModule {}
