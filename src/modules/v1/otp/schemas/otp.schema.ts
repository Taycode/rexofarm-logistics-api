import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpTypeEnum } from '@v1/users/enums/otp-type.enum';
import { User } from '@v1/users/schemas/users.schema';
import * as mongoose from 'mongoose';
import { Type } from 'class-transformer';

@Schema()
export class OTP {
	_id:string;

  @Prop({ required: true, type: String })
  	otp: string;

  @Prop({ required: true, type: String, enum: OtpTypeEnum })
  	type: OtpTypeEnum;

  @Prop({
  	type: Date,
  	default: Date.now,
  	index: { expires: '10m' },
  })
  	expiresAt: () => number = Date.now;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
  	user: User;
}

export type OTPDocument = OTP & Document;

export const OTPSchema = SchemaFactory.createForClass(OTP).set('versionKey', false);
