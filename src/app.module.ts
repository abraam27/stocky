import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FetchUserMiddleware } from './common/middleware';
import { UsersModule } from './users/users.module';
import { MongoosePluggedModule } from './common/db';
import { AppConfigs } from './app-configs';
import { StoresModule } from './stores/stores.module';

@Global()
@Module({
  imports: [
    MongoosePluggedModule.forRoot(AppConfigs.mongoDbUri),
    UsersModule,
    StoresModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FetchUserMiddleware).forRoutes('*');
  }
}
