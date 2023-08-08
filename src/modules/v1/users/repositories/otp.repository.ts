import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import CreateOTPDto from '@v1/auth/dto/create-otp.dto';

import { OTP, OTPDocument } from '@v1/users/schemas/otp.schema';

import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';
import { BaseRepository } from '../../../../common/repositories/base.repository';

@Injectable()

export default class OTPRepository extends BaseRepository<OTPDocument> {
  constructor(
        @InjectModel(OTP.name) private otpModel: Model<OTPDocument>,
  ) {
    super(otpModel);
  }

  // the repo methods below are for forgotPassword type but more could be created if it will be used for signup
  public async createOtp(userVer: CreateOTPDto): Promise<OTP> {
    return this.otpModel.create({
      ...userVer,
      type: OtpTypeEnum.FORGOT_PASSWORD,
    });
  }

  public async VerifyOtp(userVer:CreateOTPDto): Promise<OTP | null> {
    return this.otpModel.findOne({
      email: userVer.email,
      otp: userVer.otp,
      type: OtpTypeEnum.FORGOT_PASSWORD,
    }).lean();
  }
}
