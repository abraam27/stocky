import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export enum UserRole {
  Owner = 'owner',
  Admin = 'admin',
  User = 'user',
}

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export declare type User = {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  store_id: string;
};
