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
  async getPartners(@Query() query: any, @LoggedUser() user: User) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.storeService.getPartners(options);
  }

  @Get(':partner_id')
  async getPartnerById(
    @Param('partner_id') partnerId: string,
    @LoggedUser() user: User,
  ) {
    const partner = await this.storeService.getPartnerById(partnerId);
    // const isAdmin = isItemAdmin(partner, user);
    // if (!isAdmin) throw new AuthorizationError('Action not allowed');
    return partner;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.storeService.createUser(body, user);
  }

  @Put(':partner_id')
  async updatePartner(
    @Param('partner_id') partnerId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.storeService.updateUser(partnerId, body, user);
  }

  @Delete(':partner_id')
  async deletePartner(
    @Param('partner_id') partnerId: string,
    @LoggedUser() user: User,
  ) {
    return await this.storeService.deleteUser(partnerId, user);
  }
}
