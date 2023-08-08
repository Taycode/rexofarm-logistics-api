import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';

@Schema()
export class OTP {
  _id:string;

  @Prop({
    required: true,
    type: String,
  })
    email: string = '';

  @Prop({
    required: true,
    type: String,
  })
    otp:string = '';

  @Prop({
    type: [String],
    required: true,
  })
    type: OtpTypeEnum[] = [];

  @Prop({
    type: Date,
    default: Date.now,
    index: { expires: '10m' },
  })
    expiresAt: () => number = Date.now;
}

export type OTPDocument = OTP & Document;

export const OTPSchema = SchemaFactory.createForClass(OTP).set('versionKey', false);
