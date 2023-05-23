import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DriversModule } from '@v1/drivers/drivers.module';
import { UserSchema, User } from './schemas/users.schema';

import UsersController from './users.controller';
import UsersService from './users.service';
import UsersRepository from './users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema,
    }]),
    DriversModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository, MongooseModule],
})
export default class UsersModule {}
