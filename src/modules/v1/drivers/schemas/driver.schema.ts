import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '@v1/users/schemas/users.schema';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
class NextOfKin {
  @Prop({ type: String, required: true })
    fullName: string;

  @Prop({ type: String, required: true })
    gender: string;

  @Prop({ type: String, required: true })
    relationship: string;

  @Prop({ type: String, required: true })
    phone: string;

  @Prop({ type: String, required: true })
    state: string;

  @Prop({ type: String, required: true })
    city: string;

  @Prop({ type: String, required: true })
    address: string;
}
@Schema()
export class Driver {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
    user: User;

  @Prop({ type: String, required: true })
    firstName: string;

  @Prop({ type: String, required: true })
    lastName: string;

  @Prop({ type: String, required: true })
    phone: string;

  @Prop({ type: String })
    state: string;

  @Prop({ type: String })
    city: string;

  @Prop({ type: String })
    address: string;

  @Prop({ type: String })
    driverLicenseUrl: string;

  @Prop({ type: String })
    driverNinUrl: string;

  @Prop({ type: NextOfKin })
    nextOfKin: NextOfKin;
}

export type DriverDocument = Driver & Document;

export const DriverSchema = SchemaFactory.createForClass(Driver);
