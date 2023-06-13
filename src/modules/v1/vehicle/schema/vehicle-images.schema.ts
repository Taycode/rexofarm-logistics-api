import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import mongoose, { Document } from 'mongoose';
import { Type } from 'class-transformer';

@Schema({ timestamps: true })
export class VehicleImage {
  @Prop({ type: String })
    url: String;

  @Prop({ type: String })
    publicId: String;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Vehicle.name, required: true })
  @Type(() => Vehicle)
    vehicle: Vehicle;
}

export type VehicleImageDocument = Document & VehicleImage;

export const VehicleImageSchema = SchemaFactory.createForClass(VehicleImage);
