import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import UsersModule from '@v1/users/users.module';
import AuthRepository from './auth.repository';
import JwtAccessStrategy from './strategies/jwt-access.strategy';
import JwtRefreshStrategy from './strategies/jwt-refresh.strategy';

import authConstants from './auth-constants';

import AuthController from './auth.controller';
import AuthService from './auth.service';
import { JwtStrategy } from '@v1/auth/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: authConstants.jwt.secret,
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AuthRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export default class AuthModule {}
