import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppConfigs } from 'src/app-configs';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ message: string; token: string }> {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username and Password mismatch');
    }

    const payload = {
      userID: user._id,
      storeID: user.store_id,
      isLoggedIn: true,
      role: user.role,
      userName: user.username,
    };

    const token = this.jwtService.sign(payload, {
      secret: AppConfigs.tokenSignature,
    });

    return { message: 'Login Success', token };
  }

  async authorize(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: AppConfigs.tokenSignature,
      });
      const user = await this.userService.getUserById(decoded.userID);
      if (!user) throw new UnauthorizedException('Invalid');
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
