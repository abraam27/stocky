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
import { ProductService } from '../services/product.service';
import { User } from 'src/users/dtos/user.dto';

@Controller('admin-api/products')
export class ProductsAdminController {
  constructor(private productService: ProductService) {}

  @Get()
  async getPartners(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.productService.getProducts(options);
  }

  @Get(':product_id')
  async getPartnerById(@Param('product_id') ProductId: string) {
    const partner = await this.productService.getProductById(ProductId);
    // const isAdmin = isItemAdmin(partner, user);
    // if (!isAdmin) throw new AuthorizationError('Action not allowed');
    return partner;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.productService.createProduct(body, user);
  }

  @Put(':product_id')
  async updatePartner(
    @Param('product_id') ProductId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.productService.updateProduct(ProductId, body, user);
  }

  @Delete(':product_id')
  async deletePartner(
    @Param('product_id') ProductId: string,
    @LoggedUser() user: User,
  ) {
    return await this.productService.deleteProduct(ProductId, user);
  }
}
