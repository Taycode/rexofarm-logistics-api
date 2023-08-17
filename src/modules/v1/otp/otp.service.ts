import { Injectable } from '@nestjs/common';
import { OTPRepository } from '@v1/otp/otp.repository';
import { User } from '@v1/users/schemas/users.schema';
import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';
import { generateOtp } from '@v1/otp/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyOtpPayload } from '@v1/otp/interfaces/verify-user-otp.interface';

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
}
