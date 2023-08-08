import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
    type: Date,
    default: Date.now,
    index: { expires: '10m' },
  })
    expiresAt: () => number = Date.now;
}

export type OTPDocument = OTP & Document;

export const OTPSchema = SchemaFactory.createForClass(OTP).set('versionKey', false);
