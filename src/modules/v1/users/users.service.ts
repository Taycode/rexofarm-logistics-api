import * as bcrypt from 'bcryptjs';

import { Types, Connection } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@v1/users/schemas/users.schema';
import { InjectConnection } from '@nestjs/mongoose';
import SignUpDto from '@v1/users/dto/controller/sign-up.dto';
import { DriversService } from '@v1/drivers/drivers.service';
import ChangePasswordDto from '@v1/users/dto/change-password.dto';
import { generateOtp } from '@v1/auth/helpers/utils';
import OTPRepository from '@v1/users/repositories/otp.repository';
import { UserInterface } from '@v1/users/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import VerifyUserDto from '@v1/auth/dto/verify-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import UsersRepository from './repositories/users.repository';

@Injectable()
export default class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly driversService: DriversService,
    private readonly otpRepository: OTPRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  public async create(user: SignUpDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const session = await this.connection.startSession();
    let createdUserAndDriver;
    await session.withTransaction(async (txn) => {
      const createdUser = await this.usersRepository.createWithTransaction({
        password: hashedPassword,
        email: user.email,
      }, txn);
      const driver = await this.driversService.createDriver({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      }, createdUser, txn);
      await txn.commitTransaction();
      createdUserAndDriver = { user: createdUser, driver };
    });
    await session.endSession();
    const otp = generateOtp(6);
    const otpDoc = await this.otpRepository.createOtp({ email: user.email, otp });
    const userPayload : UserInterface = {
      _id: otpDoc._id,
      email: otpDoc.email,
    };
    const token = await this.jwtService.signAsync(userPayload, {
      secret: this.configService.get<string>('SECRET'),
      expiresIn: '30m',
    });

    // return a token they can use to verify their mails

    if (createdUserAndDriver) return { createdUserAndDriver, token };
    throw new Error('Could not create user');
  }

  public async verifyUser(payload:VerifyUserDto, otpId:string) {
    const isVerified = await this.otpRepository.VerifyOtp(payload, otpId);
    if (!isVerified) {
      throw new BadRequestException('Otp entered is incorrect');
    }

    const user = await this.usersRepository.getUserByEmail(payload.email);
    if (!user) {
      throw new BadRequestException('no user with this email');
    }

    const verifiedUser = await this.usersRepository.updateById(user._id, { ...user, verified: true });

    const userPayload: UserInterface = {
      _id: user._id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(userPayload, {
      secret: this.configService.get<string>('SECRET'),
      expiresIn: '1h',
    });

    return { token, verifiedUser };
  }

  public async changePassword(details: ChangePasswordDto, userId: string) {
    const { oldPassword, newPassword } = details;

    const user = await this.usersRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('No user found with this id');
    }
    const isCorrect = await bcrypt.compare(oldPassword, user?.password!);
    if (!isCorrect) {
      throw new BadRequestException('Password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.updateById(userId, {
      email: user.email,
      password: hashedPassword,
      verified: true,
    });
  }

  public update(
    id: Types.ObjectId,
    data: UpdateUserDto,
  ): Promise<User | null> {
    return this.usersRepository.updateById(id, data);
  }
}
