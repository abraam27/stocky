import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class FetchUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const token = this.getTokenFromRequest(req);
    if (!token) return next();

    const user = await this.getUserByToken(token);

    if (!user.organization_id?.trim()) user.organization_id = null;
    if (!user.fund_raiser_id?.trim()) user.fund_raiser_id = null;
    req['user'] = user;
    next();
  }

  private getTokenFromRequest(req: Request) {
    return req.headers.authorization?.replace('Bearer ', '');
  }

  private async getUserByToken(token: string): Promise<any> {
    try {
      return await this.userService.authenticate(token);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
