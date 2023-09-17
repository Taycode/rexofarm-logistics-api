import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '@v1/users/schemas/users.schema';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
class NextOfKin {
  @ApiProperty()
  @Prop({ type: String, required: true })
  	fullName: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	gender: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	relationship: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	phone: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	state: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	city: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	address: string;
}

@Schema()
export class Driver {
  @ApiProperty({ type: () => User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
  	user: User;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	firstName: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	lastName: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	phone: string;

  @ApiProperty()
  @Prop({ type: String })
  	state: string;

  @ApiProperty()
  @Prop({ type: String })
  	city: string;

  @ApiProperty()
  @Prop({ type: String })
  	address: string;

  @ApiProperty()
  @Prop({ type: String })
  	driverLicenseUrl: string;

  @ApiProperty()
  @Prop({ type: String })
  	driverNinUrl: string;

  @ApiProperty({ type: () => NextOfKin })
  @Prop({ type: NextOfKin })
  	nextOfKin: NextOfKin;
}

export type DriverDocument = Driver & Document;

export const DriverSchema = SchemaFactory.createForClass(Driver);
