import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FetchUserMiddleware } from './common/middleware';
import { UsersModule } from './users/users.module';
import { MongoosePluggedModule } from './common/db';
import { AppConfigs } from './app-configs';
import { StoresModule } from './stores/stores.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TransactionsModule } from './transactions/transactions.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoosePluggedModule.forRoot(AppConfigs.mongoDbUri),
    UsersModule,
    StoresModule,
    OrdersModule,
    CustomersModule,
    ProductsModule,
    AuthModule,
    TransactionsModule,
  ],
  providers: [AuthService, JwtService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FetchUserMiddleware).forRoutes('*');
  }
}
