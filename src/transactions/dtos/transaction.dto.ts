import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

export enum TransactionType {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  store_id: string;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
