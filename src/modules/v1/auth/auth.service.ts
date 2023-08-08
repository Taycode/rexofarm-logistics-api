import * as bcrypt from 'bcryptjs';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import UsersRepository from '@v1/users/repositories/users.repository';
import { User } from '@v1/users/schemas/users.schema';
import { UserInterface } from '@v1/users/interfaces/user.interface';
import SignInDto from '@v1/auth/dto/sign-in.dto';
import { generateOtp } from '@v1/auth/helpers/utils';
import OTPRepository from '@v1/users/repositories/otp.repository';
import CreateOTPDto from '@v1/auth/dto/create-otp.dto';
import JwtTokensDto from './dto/jwt-tokens.dto';
import { ValidatePasswordResetDto } from '@v1/auth/dto/password-reset.dto';

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly userVerRepository: OTPRepository,
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

  public async forgotPasswordOtpRequest(email:string):Promise<void > {
    const exists = await this.usersRepository.getUserByEmail(email);
    if (!exists) {
      throw new NotFoundException('user does not exist, signup instead');
    }

    const otp = generateOtp(6);
    await this.userVerRepository.createOtp({ email, otp });
    // email service goes here
  }

  public async validatePasswordResetOTP(payload: ValidatePasswordResetDto) {
    const isVerified = await this.userVerRepository.VerifyOtp(payload);

    if (!isVerified) {
      throw new BadRequestException('Otp is wrong');
    }

    const user = await this.usersRepository.getUserByEmail(payload.email);
    if (!user) return null;
    const userPayload: UserInterface = {
      _id: user._id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(userPayload, {
      secret: this.configService.get<string>('SECRET'),
      expiresIn: '1h',
    });

    return {
      token,
    };

    // return a short lived token that will be used to set a new password
  }

  public async resetPassword(data:SignInDto):Promise<any> {
    const { email, password } = data;
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('error getting user');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.updateById(user._id, {
      email,
      password: hashedPassword,
      verified: true,
    });

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
