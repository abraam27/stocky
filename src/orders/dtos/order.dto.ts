import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { type } from 'os';

export enum OrderStatus {
  Completed = 'completed',
  Refunded = 'refunded',
}

export enum PaymentMethod {
  Cash = 'cash',
  Card = 'card',
}

export class OrderProductDto {
  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  discount: number;
}

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @IsNotEmpty()
  store_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  @IsNotEmpty()
  products: OrderProductDto[];

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  discount_value?: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method?: PaymentMethod;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

type BooleanAsString = 'true' | 'false';

export type GetOrdersDto = {
  _id?: string;
  status?: string;
  customer_id?: string;
  user_id?: string;
  store_id?: string;
  limit?: number;
  page?: number;
  exactly?: BooleanAsString;
  pagination?: boolean;
  sort?: string | Record<string, 1 | -1>;
  select?: string | Record<string, 0 | 1>;
};
