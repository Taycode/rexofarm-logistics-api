import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@v1/users/schemas/users.schema';
import { KYCStatus, KYCType } from '@v1/kyc/enums/kyc.enum';
import mongoose, { Document } from 'mongoose';
import { Type } from 'class-transformer';

@Schema({ _id: false })
export class KYCFile {
  @Prop({ type: String })
    url: string;

  @Prop({ type: String })
    publicId: string;
}

// Register the KYCFile schema with Mongoose
export const KYCFileSchema = SchemaFactory.createForClass(KYCFile);

@Schema({ timestamps: true })
export class KYC {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
    user: User;

  @Prop({ type: String, enum: KYCStatus, default: KYCStatus.PENDING })
    status: KYCStatus;

  @Prop({ type: String, enum: KYCType })
    type: KYCType;

  @Prop({ type: [KYCFileSchema] }) // Use the registered KYCFileSchema for the files array
    files: KYCFile[];
}

export type KYCDocument = Document & KYC;
export const KYCSchema = SchemaFactory.createForClass(KYC);
