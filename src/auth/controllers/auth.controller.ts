import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth-api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    try {
      const result = await this.authService.login(username, password);
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}