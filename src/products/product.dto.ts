import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min, ValidateNested } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  barcode_number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  material?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  product_variant: CreateProductVariantDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }

export class CreateProductVariantDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsNumber()
  @IsNotEmpty()
  sku?: number;

  @IsNumber()
  @IsNotEmpty()
  cost_price: number;

  @IsNumber()
  @IsNotEmpty()
  selling_price: number;

  @IsNumber()
  @IsOptional()
  discount_price?: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsBoolean()
  @IsNotEmpty()
  in_stock: boolean;

  @IsString()
  @IsOptional()
  store_id?: string;

  @IsString()
  @IsOptional()
  confirmed_by?: string;

  @IsString()
  @IsOptional()
  saved_by: string;
}

export class UpdateProductVariantDto extends PartialType(CreateProductVariantDto) { }

export type Quantity = {
  quantity: number;
  store_id: string
}

export class AssignProductVariantsDto {
  @IsArray()
  @IsNotEmpty()
  product_variants: {
    product_id: string,
    variant_id: string,
    store_id: string,
    quantity: number,
  }[];
}

export class ConfirmProductVariantsDto {
  @IsArray()
  @IsNotEmpty()
  product_variants: {
    product_id: string,
    variant_id: string[]
  }[];
}