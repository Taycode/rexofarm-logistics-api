import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';

export default class CreateOTPDto {
  otp: string;

  type: OtpTypeEnum;
}
