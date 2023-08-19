import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DriversModule } from '@v1/drivers/drivers.module';
import { UserSchema, User } from './schemas/users.schema';

import UsersController from './users.controller';
import UsersService from './users.service';
import UsersRepository from './repositories/users.repository';
import { JwtModule } from "@nestjs/jwt";
import { OTPModule } from "@v1/otp/otp.module";

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: User.name,
			schema: UserSchema,
		}]),
		DriversModule,
		JwtModule,
		OTPModule,
	],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
	exports: [UsersService, UsersRepository],
})
export default class UsersModule {}
