import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum OrderStatus {
  Completed = 'completed',
  refunded = 'Refunded',
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
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  user_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  total: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method?: PaymentMethod;
}
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
