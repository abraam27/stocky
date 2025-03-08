import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  orders: string[];

  @IsString()
  @IsNotEmpty()
  saved_by: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
