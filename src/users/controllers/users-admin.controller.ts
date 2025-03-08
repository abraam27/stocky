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
import { UserService } from '../services/user.service';
import { User } from '../dtos/user.dto';
import { LoggedUser } from 'src/common/decorators/genwin';

@Controller('admin-api/partners')
export class PartnersAdminController {
  constructor(private userService: UserService) {}

  @Get()
  async getPartners(@Query() query: any, @LoggedUser() user: User) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.userService.getPartners(options);
  }

  @Get(':partner_id')
  async getPartnerById(
    @Param('partner_id') partnerId: string,
    @LoggedUser() user: User,
  ) {
    const partner = await this.userService.getPartnerById(partnerId);
    // const isAdmin = isItemAdmin(partner, user);
    // if (!isAdmin) throw new AuthorizationError('Action not allowed');
    return partner;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.userService.createUser(body, user);
  }

  @Put(':partner_id')
  async updatePartner(
    @Param('partner_id') partnerId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.userService.updateUser(partnerId, body, user);
  }

  @Delete(':partner_id')
  async deletePartner(
    @Param('partner_id') partnerId: string,
    @LoggedUser() user: User,
  ) {
    return await this.userService.deleteUser(partnerId, user);
  }
}
