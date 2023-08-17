import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class VehicleImage {
  @ApiProperty()
  @Prop({ type: String })
  	url: String;

  @ApiProperty()
  @Prop({ type: String })
  	publicId: String;

  @ApiProperty({ type: () => Vehicle })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Vehicle.name, required: true })
  @Type(() => Vehicle)
  	vehicle: Vehicle;
}

export type VehicleImageDocument = VehicleImage & Document;

export const VehicleImageSchema = SchemaFactory.createForClass(VehicleImage);
