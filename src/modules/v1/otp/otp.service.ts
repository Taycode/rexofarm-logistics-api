import { Injectable } from '@nestjs/common';
import { OTPRepository } from '@v1/otp/otp.repository';
import { User } from '@v1/users/schemas/users.schema';
import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';
import { generateOtp } from '@v1/otp/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CompletePasswordResetOTPPayload, VerifyOtpPayload } from "@v1/otp/interfaces/verify-user-otp.interface";

@Injectable()
export class OtpService {
	constructor(
    private readonly otpRepository: OTPRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async generateAndCreateOTP(user: User, otpType: OtpTypeEnum) {
  	await this.otpRepository.deleteMany({ user, type: otpType });
		const otp = generateOtp(6);
		const otpModel = await this.otpRepository.createOtp(user, otp, otpType);
		// ToDO:  Send the OTP through Email/SMS
		const otpSignedPayload: VerifyOtpPayload = {
			otpId: otpModel._id,
			userId: user._id,
		};
		return this.jwtService.signAsync(otpSignedPayload, {
			secret: this.configService.get<string>('SECRET'),
			expiresIn: '1m',
		});
	}

	async validateOTP(user: User, otpType: OtpTypeEnum, otp: string) {
	  const otpModel = await this.otpRepository.findOne({
		  user,
		  type: otpType,
		  otp,
	  });
	  if (otpModel) {
			await this.otpRepository.deleteMany({
				user,
				type: otpType,
			});
			return undefined;
		}
	  throw new Error('OTP not Valid');
	}

	async validateOTPForPasswordReset(verificationToken: string, otp: string) {
		const decodedPayload: VerifyOtpPayload = await this.jwtService.verifyAsync(
			verificationToken,
			{
				secret: this.configService.get<string>('SECRET'),
			},
		);
		const otpModel = await this.otpRepository.findOne({
			type: OtpTypeEnum.FORGOT_PASSWORD,
			otp,
			_id: decodedPayload.otpId,
			user: decodedPayload.userId as unknown as User, // Hack for fetching user
		});
		if (!otpModel) throw new Error('Could not validate OTP');
		const returnPayload: CompletePasswordResetOTPPayload = {
			otpId: otpModel._id,
			userId: decodedPayload.userId,
			otp,
		}
		return this.jwtService.signAsync(returnPayload, {
			secret: this.configService.get<string>('SECRET'),
			expiresIn: '1m',
		});
	}

	async completeOTPValidationForPasswordReset(verificationToken: string) {
		const decodedPayload: CompletePasswordResetOTPPayload = await this.jwtService.verifyAsync(
			verificationToken,
			{
				secret: this.configService.get<string>('SECRET'),
			},
		);
		const otpModel = await this.otpRepository.findOne({
			type: OtpTypeEnum.FORGOT_PASSWORD,
			otp: decodedPayload.otp,
			_id: decodedPayload.otpId,
			user: decodedPayload.userId as unknown as User, // Hack for fetching user
		});
		if (!otpModel) throw new Error('Could not reset password');
		await this.otpRepository.deleteMany({
			type: OtpTypeEnum.FORGOT_PASSWORD,
			user: decodedPayload.userId as unknown as User,
		});
		return decodedPayload;
	}
}
