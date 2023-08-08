import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import CreateUserverifDto from '@v1/auth/dto/create-userverif.dto';

import { UserVerification, UserVerificationDocument } from '@v1/users/schemas/users.verification.schema';

import { BaseRepository } from '../../../common/repositories/base.repository';
import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';

@Injectable()

export default class UsersVerificationRepository extends BaseRepository<UserVerificationDocument> {
  constructor(
        @InjectModel(UserVerification.name) private usersVerificationModel: Model<UserVerificationDocument>,
  ) {
    super(usersVerificationModel);
  }

  // the repo methods below are for forgotPassword type but more could be created if it will be used for signup
  public async createOtp(userVer: CreateUserverifDto): Promise<UserVerification> {
    return this.usersVerificationModel.create({
      ...userVer,
      type: OtpTypeEnum.FORGOT_PASSWORD,
    });
  }

  public async VerifyOtp(userVer:CreateUserverifDto): Promise<UserVerification | null> {
    return this.usersVerificationModel.findOne({
      email: userVer.email,
      otp: userVer.otp,
      type: OtpTypeEnum.FORGOT_PASSWORD,
    }).lean();
  }
}
