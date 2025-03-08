import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StoresAdminController } from './controllers/users-admin.controller';
import { StoresAppController } from './controllers/users-app.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [StoresAdminController, StoresAppController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
