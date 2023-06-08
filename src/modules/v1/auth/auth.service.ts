import * as bcrypt from 'bcryptjs';

import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import UsersRepository from '@v1/users/users.repository';
import { User } from '@v1/users/schemas/users.schema';
import { UserInterface } from '@v1/users/interfaces/user.interface';
import SignInDto from '@v1/auth/dto/sign-in.dto';
import JwtTokensDto from './dto/jwt-tokens.dto';

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
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
    const token = await this.jwtService.signAsync(userPayload, {
      secret: this.configService.get<string>('SECRET'),
    });

    return {
      token,
    };
  }
}
