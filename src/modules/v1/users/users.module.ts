import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DriversModule } from '@v1/drivers/drivers.module';
import { UserSchema, User } from './schemas/users.schema';

import UsersController from './users.controller';
import UsersService from './users.service';
import UsersRepository from './repositories/users.repository';
import OTPRepository from '@v1/otp/otp.repository';

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: User.name,
			schema: UserSchema,
		}]),
		DriversModule,
	],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository, OTPRepository],
	exports: [UsersService, UsersRepository, OTPRepository],
})
export default class UsersModule {}
