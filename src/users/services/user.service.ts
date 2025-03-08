import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto, User } from '../dtos/user.dto';
import { isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(options: MongoDbFindOptions<any>) {
    const query: FilterQuery<User> = {};

    if (options.filter?._id) {
      query._id = new Types.ObjectId(options.filter?._id);
    }

    if (options.filter?.name) {
      query.name = options.filter?.name;
    }

    if (options.filter?.alias) {
      query.alias = options.filter?.alias;
    }

    if (options.filter?.organization_id) {
      query.organization_id = options.filter?.organization_id;
    }

    if (options.filter?.fund_raiser_id) {
      query.fund_raiser_id = { $in: [options.filter?.fund_raiser_id, null] };
    }

    if (options.filter?.plaid_id) {
      query['plaid.id'] = options.filter?.plaid_id;
    }

    if (options?.filter?.key) {
      query.$or = [{ name: { $regex: options.filter.key, $options: 'i' } }];
    }

    return this.userRepository.findAndPaginate({
      ...options?.filter,
      ...options,
      filter: query,
    });
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    return user;
  }

  async createUser(dto: CreateUserDto, user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return await this.userRepository.createUser({
      ...dto,
      password: hashedPassword,
    });
  }

  async updateUser(userId: string, dto: UpdateUserDto, user: User) {
    const _user = await this.userRepository.findById(userId);
    if (!_user) throw new NotFoundException(`User with ID ${userId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    return await this.userRepository.updateUserById(_user._id, dto);
  }

  async deleteUser(userId: string, user: User) {
    const _user = await this.userRepository.findById(userId);
    if (!_user) throw new NotFoundException(`User with ID ${userId} not found`);

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    await this.userRepository.deleteUserById(_user._id);
    return { _id: _user._id };
  }

  async authenticate(token: string) {
    return token;
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    return await this.userRepository.findOne({ username });
  }
}
