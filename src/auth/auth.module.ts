import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AppConfigs } from 'src/app-configs';
import { AuthController } from './auth.controller';

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
export class AuthModule {}
