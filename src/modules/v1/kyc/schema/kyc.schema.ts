import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@v1/users/schemas/users.schema';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { KYCStatus, KYCType } from '@v1/kyc/enums/kyc.enum';

@Schema({ _id: false })
export class KYCFile {
  @ApiProperty()
  @Prop({ type: String })
    url: string;

  @ApiProperty()
  @Prop({ type: String })
    publicId: string;
}

// Register the KYCFile schema with Mongoose
export const KYCFileSchema = SchemaFactory.createForClass(KYCFile);

@Schema({ timestamps: true })
export class KYC {
  @ApiProperty({ type: () => User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
    user: User;

  @ApiProperty({ enum: KYCStatus, default: KYCStatus.PENDING })
  @Prop({ type: String, enum: KYCStatus, default: KYCStatus.PENDING })
    status: KYCStatus;

  @ApiProperty({ enum: KYCType })
  @Prop({ type: String, enum: KYCType })
    type: KYCType;

  @ApiProperty({ type: () => [KYCFile] })
  @Prop({ type: [KYCFileSchema] }) // Use the registered KYCFileSchema for the files array
    files: KYCFile[];
}

export type KYCDocument = KYC & Document;
export const KYCSchema = SchemaFactory.createForClass(KYC);
