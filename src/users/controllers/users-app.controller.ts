import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('app-api/users')
export class StoresAppController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUsers(@Query() query: any) {
    const options = {
      ...query,
      filter: {
        ...query,
      },
    };
    return await this.userService.getUsers(options);
  }

  @Get(':user_id')
  async getUserById(@Param('user_id') UserId: string) {
    return await this.userService.getUserById(UserId);
  }
}
