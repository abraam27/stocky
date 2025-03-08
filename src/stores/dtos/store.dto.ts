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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  @IsOptional()
  transactions?: CreateTransactionDto[];
}

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}

export enum TransactionType {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  amount: number;

  @IsString()
  reason: string;

  @IsDate()
  timestamp: Date;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
