import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StoreService } from './services/store.service';
import { Store, StoreSchema } from './schemas/store.schema';
import { StoresAdminController } from './controllers/stores.controller';
import { StoreRepository } from './repositories/store.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  controllers: [StoresAdminController],
  providers: [StoreService, StoreRepository],
  exports: [StoreService],
})
export class StoresModule {}
