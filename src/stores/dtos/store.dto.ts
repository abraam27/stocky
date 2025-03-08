import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  manager_id?: string;

  @IsNumber()
  @IsOptional()
  cashInVault?: number;
}

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
