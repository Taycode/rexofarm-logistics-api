import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { OtpTypeEnum } from '@decorators/otp-type.decorator';

@Schema()
export class UserVerification {
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

export type UserVerificationDocument = UserVerification & Document;

export const UserVerificationSchema = SchemaFactory.createForClass(UserVerification).set('versionKey', false);
