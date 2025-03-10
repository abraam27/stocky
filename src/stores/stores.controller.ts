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
import { User } from 'src/users/user.dto';
import { StoreService } from './store.service';

@Controller('api/stores')
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

  @Get(':store_id')
  async getStoreById(@Param('store_id') StoreId: string) {
    const Store = await this.storeService.getStoreById(StoreId);
    // const isAdmin = isItemAdmin(Store, user);
    // if (!isAdmin) throw new AuthorizationError('Action not allowed');
    return Store;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.storeService.createStore(body, user);
  }

  @Put(':store_id')
  async updateStore(
    @Param('store_id') StoreId: string,
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
