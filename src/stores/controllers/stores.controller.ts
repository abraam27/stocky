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
import { StoreService } from '../services/store.service';

@Controller('admin-api/stores')
export class StoresAdminController {
  constructor(private storeService: StoreService) {}

  @Get()
  async getStores(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.storeService.getStores(options);
  }

  @Get(':Store_id')
  async getStoreById(@Param('Store_id') StoreId: string) {
    const Store = await this.storeService.getStoreById(StoreId);
    // const isAdmin = isItemAdmin(Store, user);
    // if (!isAdmin) throw new AuthorizationError('Action not allowed');
    return Store;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.storeService.createStore(body, user);
  }

  @Put(':Store_id')
  async updateStore(
    @Param('Store_id') StoreId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.storeService.updateStore(StoreId, body, user);
  }

  @Delete(':store_id')
  async deleteStore(
    @Param('store_id') storeId: string,
    @LoggedUser() user: User,
  ) {
    return await this.storeService.deleteStore(storeId, user);
  }
}
