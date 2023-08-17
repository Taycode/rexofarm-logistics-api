import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { OTP, OTPDocument } from '@v1/otp/schemas/otp.schema';

import { User } from '@v1/users/schemas/users.schema';
import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()

export class OTPRepository extends BaseRepository<OTPDocument> {
	constructor(
        @InjectModel(OTP.name) private otpModel: Model<OTPDocument>,
	) {
		super(otpModel);
	}

	public async createOtp(user: User, otp: string, type: OtpTypeEnum): Promise<OTP> {
		return this.otpModel.create({
			user,
			otp,
			type,
		});
	}
}
