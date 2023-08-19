import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from '@decorators/roles.decorator';

@Schema()
export class User {
  @ApiProperty()
  	_id: string;

  @ApiProperty()
  @Prop({
  	required: true,
  	unique: true,
  	type: String,
  })
  	email: string = '';

  @ApiProperty()
  @Prop({
  	required: true,
  	type: String,
  })
  	password: string = '';

  @ApiProperty()
  @Prop({
  	required: true,
  	type: Boolean,
  })
  	verified: boolean = false;

  @ApiProperty({ type: [String], enum: RolesEnum, default: [RolesEnum.USER] })
  @Prop({
  	type: [String],
  	required: false,
  	default: [RolesEnum.USER],
  })
  	roles: RolesEnum[] = [];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User).set('versionKey', false);
