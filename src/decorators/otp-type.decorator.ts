import { SetMetadata } from '@nestjs/common';

export enum OtpTypeEnum {
    SIGN_UP = 'SIGN_UP',
    FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}

export const OtpType = (...otp:OtpType[]) => SetMetadata('otptype', otp);
