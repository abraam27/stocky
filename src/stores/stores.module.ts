import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StoreService } from './store.service';
import { Store, StoreSchema } from './store.schema';
import { StoresAdminController } from './stores.controller';
import { StoreRepository } from './store.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  controllers: [StoresAdminController],
  providers: [StoreService, StoreRepository],
  exports: [StoreService],
})
export class StoresModule {}
