import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { UserService } from 'src/users/services/user.service';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/users/users.module';
import { AppConfigs } from 'src/app-configs';

@Module({
  imports: [
    JwtModule.register({
      secret: AppConfigs.tokenSignature,
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule { }