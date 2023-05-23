import * as bcrypt from 'bcryptjs';

import {
  HttpException, HttpStatus, Injectable, NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import UsersRepository from '@v1/users/users.repository';
import { User } from '@v1/users/schemas/users.schema';
import { UserInterface } from '@v1/users/interfaces/user.interface';
import SignInDto from '@v1/auth/dto/sign-in.dto';
import { DecodedUser } from './interfaces/decoded-user.interface';
import JwtTokensDto from './dto/jwt-tokens.dto';

import authConstants from './auth-constants';
import AuthRepository from './auth.repository';

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) { }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<null | Omit<User, 'password'>> {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('The item does not exist');
    }

    const { password: userPassword, ...userWithoutPassword } = user;
    const passwordCompared = await bcrypt.compare(password, userPassword);

    if (passwordCompared) {
      return userWithoutPassword;
    }

    return null;
  }

  public async login(data: SignInDto): Promise<JwtTokensDto | null> {
    const { email, password } = data;
    const user = await this.validateUser(email, password);
    if (!user) return null;
    const userPayload: UserInterface = {
      _id: user._id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(userPayload, {
      expiresIn: authConstants.jwt.expirationTime.accessToken,
      secret: this.configService.get<string>('ACCESS_TOKEN'),
    });

    return {
      accessToken,
    };
  }

  public getRefreshTokenByEmail(email: string): Promise<string | null> {
    return this.authRepository.getToken(email);
  }

  public deleteTokenByEmail(email: string): Promise<number> {
    return this.authRepository.removeToken(email);
  }

  public deleteAllTokens(): Promise<string> {
    return this.authRepository.removeAllTokens();
  }

  public createVerifyToken(id: Types.ObjectId): string {
    return this.jwtService.sign(
      { id },
      {
        expiresIn: authConstants.jwt.expirationTime.accessToken,
        secret: this.configService.get<string>('ACCESS_TOKEN') || '283f01ccce922bcc2399e7f8ded981285963cec349daba382eb633c1b3a5f282',
      },
    );
  }

  public verifyEmailVerToken(token: string, secret: string) {
    return this.jwtService.verifyAsync(token, { secret });
  }

  public async verifyToken(
    token: string,
    secret: string,
  ): Promise<DecodedUser | null> {
    try {
      const user = (await this.jwtService.verifyAsync(token, {
        secret,
      })) as DecodedUser | null;

      return user;
    } catch (error) {
      return null;
    }
  }
}
