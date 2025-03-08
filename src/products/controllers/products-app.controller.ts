import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller('app-api/products')
export class ProductsAppController {
  constructor(private readonly productService: ProductService) {}
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
  async getProductById(@Param('product_id') partnerId: string) {
    return await this.productService.getProductById(partnerId);
  }
  
}
