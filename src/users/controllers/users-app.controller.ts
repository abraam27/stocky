import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('app-api/partners')
export class PartnersAppController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getPartners(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.userService.getPartners(options);
  }

  @Get(':partner_id')
  async getPartnerById(@Param('partner_id') partnerId: string) {
    return await this.userService.getPartnerById(partnerId);
  }
}
