import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DriversModule } from '@v1/drivers/drivers.module';
import { UserSchema, User } from './schemas/users.schema';
import { UserVerificationSchema, UserVerification } from './schemas/users.verification.schema';

import UsersController from './users.controller';
import UsersService from './users.service';
import UsersRepository from './users.repository';
import UsersVerificationRepository from '@v1/users/users-verification.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema,
    }, {
      name: UserVerification.name,
      schema: UserVerificationSchema,

    }]),
    DriversModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersVerificationRepository],
  exports: [UsersService, UsersRepository, MongooseModule, UsersVerificationRepository],
})
export default class UsersModule {}
