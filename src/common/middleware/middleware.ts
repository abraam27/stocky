import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FetchUserMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const token = this.getTokenFromRequest(req);
    if (!token) return next();
    const user = await this.getUserByToken(token);
    req['user'] = user;
    next();
  }

  private getTokenFromRequest(req: Request) {
    return req.headers.authorization?.replace('Bearer ', '');
  }

  private async getUserByToken(token: string): Promise<any> {
    try {
      return await this.authService.authorize(token);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
