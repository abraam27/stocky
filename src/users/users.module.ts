import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PartnersAdminController } from './controllers/users-admin.controller';
import { PartnersAppController } from './controllers/users-app.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [PartnersAdminController, PartnersAppController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
