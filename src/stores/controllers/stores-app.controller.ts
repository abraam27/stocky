import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoreService } from '../services/store.service';

@Controller('app-api/stores')
export class StoresAppController {
  constructor(private readonly storeService: StoreService) {}
  @Get()
  async getPartners(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.storeService.getPartners(options);
  }

  @Get(':partner_id')
  async getPartnerById(@Param('partner_id') partnerId: string) {
    return await this.storeService.getPartnerById(partnerId);
  }
}
