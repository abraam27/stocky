import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../dtos/user.dto';
import { LoggedUser } from 'src/common/decorators/genwin';
import { isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';

@Controller('api/users')
export class UsersAdminController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Query() query: any, @LoggedUser() user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.userService.getUsers(options);
  }

  @Get('/:user_id')
  async getUserById(
    @Param('user_id') userId: string,
    @LoggedUser() user: User,
  ) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    const _user = await this.userService.getUserById(userId);
    return _user;
  }

  @Post()
  async create(@Body() body: any, @LoggedUser() user: User) {
    return await this.userService.createUser(body, user);
  }

  @Put(':user_id')
  async updateUser(
    @Param('user_id') UserId: string,
    @Body() body: any,
    @LoggedUser() user: User,
  ) {
    return await this.userService.updateUser(UserId, body, user);
  }

  @Delete(':user_id')
  async deleteUser(@Param('user_id') UserId: string, @LoggedUser() user: User) {
    return await this.userService.deleteUser(UserId, user);
  }
}
