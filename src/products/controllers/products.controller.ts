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

@Controller('api/products')
export class ProductsAdminController {
  constructor(private productService: ProductService) {}

  @Get()
  async getProducts(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.productService.getProducts(options);
  }

  @Get(':product_id')
  async getProductById(@Param('product_id') ProductId: string) {
    const Product = await this.productService.getProductById(ProductId);
    return Product;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.productService.createProduct(body, user);
  }

  @Put(':product_id')
  async updateProduct(
    @Param('product_id') ProductId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.productService.updateProduct(ProductId, body, user);
  }

  @Delete(':product_id')
  async deleteProduct(
    @Param('product_id') ProductId: string,
    @LoggedUser() user: User,
  ) {
    return await this.productService.deleteProduct(ProductId, user);
  }
}
