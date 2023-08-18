import * as bcrypt from 'bcryptjs';

import {
	Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import UsersRepository from '@v1/users/repositories/users.repository';
import { User } from '@v1/users/schemas/users.schema';
import { UserInterface } from '@v1/users/interfaces/user.interface';
import SignInDto from '@v1/auth/dto/sign-in.dto';
import { CompletePasswordResetDto, ValidatePasswordResetDto } from "@v1/auth/dto/password-reset.dto";
import JwtTokensDto from './dto/jwt-tokens.dto';
import { OtpService } from '@v1/otp/otp.service';
import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';

@Injectable()
export default class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersRepository: UsersRepository,
		private readonly configService: ConfigService,
		private readonly otpService: OtpService,
	) {}

	public async validateUser(
		email: string,
		password: string,
	): Promise<null | Omit<User, 'password'>> {
		const user = await this.usersRepository.getUserByEmail(email);

		if (!user) {
			throw new Error('Invalid credentials');
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

	public async initiatePasswordReset(
		email: string,
	) {
		const user = await this.usersRepository.getUserByEmail(email);

		if (user) {
			return this.otpService.generateAndCreateOTP(
				user,
				OtpTypeEnum.FORGOT_PASSWORD,
			);
		}
	}

	public async validatePasswordResetOTP(
		payload: ValidatePasswordResetDto,
	) {
		const signedPayload = await this.otpService.validateOTPForPasswordReset(payload.verificationToken, payload.otp);
		return { payload: signedPayload }
	}

	public async completeResetPassword(data: CompletePasswordResetDto): Promise<any> {
		const decodedPayload = await this
			.otpService
			.completeOTPValidationForPasswordReset(data.verificationToken);
		const hashedPassword = await bcrypt.hash(data.password, 10);
		await this.usersRepository.updateById(decodedPayload.userId, {
			password: hashedPassword,
			verified: true,
		});
	}
}
