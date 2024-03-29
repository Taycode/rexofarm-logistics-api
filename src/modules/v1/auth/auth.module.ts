import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import UsersModule from '@v1/users/users.module';
import { JwtStrategy } from '@v1/auth/strategies/jwt.strategy';

import authConstants from './auth-constants';

import AuthController from './auth.controller';
import AuthService from './auth.service';
import { OTPModule } from "@v1/otp/otp.module";

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: authConstants.jwt.secret,
		}),
		OTPModule,
	],
	providers: [
		AuthService,
		JwtStrategy,
	],
	controllers: [AuthController],
	exports: [AuthService],
})
export default class AuthModule {}
