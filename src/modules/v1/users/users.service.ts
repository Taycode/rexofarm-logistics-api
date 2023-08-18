import * as bcrypt from 'bcryptjs';

import { Connection } from 'mongoose';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { User } from '@v1/users/schemas/users.schema';
import { InjectConnection } from '@nestjs/mongoose';
import SignUpDto from '@v1/users/dto/controller/sign-up.dto';
import { DriversService } from '@v1/drivers/drivers.service';
import ChangePasswordDto from '@v1/users/dto/change-password.dto';
import { UserInterface } from '@v1/users/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import VerifyUserDto from '@v1/auth/dto/verify-user.dto';
import { OtpService } from '@v1/otp/otp.service';
import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';
import { VerifyOtpPayload } from '@v1/otp/interfaces/verify-user-otp.interface';
import UsersRepository from './repositories/users.repository';

@Injectable()
export default class UsersService {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly driversService: DriversService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		@InjectConnection() private readonly connection: Connection,
		private readonly otpService: OtpService,
	) {}

	public async create(user: SignUpDto) {
		const hashedPassword = await bcrypt.hash(user.password, 10);
		const session = await this.connection.startSession();
		let createdUserAndDriver;
		await session.withTransaction(async (txn) => {
			const createdUser =				await this.usersRepository.createWithTransaction(
				  {
				    password: hashedPassword,
				    email: user.email,
				  },
				  txn,
			);
			const driver = await this.driversService.createDriver(
				{
					firstName: user.firstName,
					lastName: user.lastName,
					phone: user.phone,
				},
				createdUser,
				txn,
			);
			await txn.commitTransaction();
			createdUserAndDriver = { user: createdUser, driver };
		});
		await session.endSession();
		if (createdUserAndDriver) return { createdUserAndDriver };
		throw new Error('Could not create user');
	}

	public async verifyUser(payload: VerifyUserDto, user: User) {
		const decodedPayload: VerifyOtpPayload = await this.jwtService.verifyAsync(
			payload.verificationToken,
			{
				secret: this.configService.get<string>('SECRET'),
			},
		);

		if (user._id === decodedPayload.userId) {
			await this.otpService.validateOTP(user, OtpTypeEnum.VERIFY_USER, payload.otp);
			const verifiedUser = await this.usersRepository.updateById(
				user._id,
				{ ...user, verified: true },
			);

			const userPayload: UserInterface = {
				_id: user._id,
				email: user.email,
			};
	  		// Generate token for a re-login
			const token = await this.jwtService.signAsync(userPayload, {
				secret: this.configService.get<string>('SECRET'),
				expiresIn: '1h',
			});

			return { token, verifiedUser };
		}

		throw new Error('Could not verify OTP');
	}

	public async initiateVerifyUser(user: User) {
		const unverifiedUser = await this.usersRepository.findOne({
			_id: user._id,
			verified: false,
		});
		if (unverifiedUser) {
			return this.otpService.generateAndCreateOTP(
				user,
				OtpTypeEnum.VERIFY_USER,
			);
		}
		throw new Error('User Already Verified');
	}

	public async changePassword(details: ChangePasswordDto, userId: string) {
		const { oldPassword, newPassword } = details;

		const user = await this.usersRepository.getById(userId);
		if (!user) {
			throw new NotFoundException('No user found with this id');
		}
		const isCorrect = await bcrypt.compare(oldPassword, user.password!);
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
}
