import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { VehicleStatus, VehicleType } from '@v1/vehicle/enums/vehicle.enum';
import mongoose, { Document } from 'mongoose';
import { Type } from 'class-transformer';

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Driver.name, required: true })
  @Type(() => Driver)
    driver: Driver;

  @Prop({ type: String, required: true })
    numberPlate: string;

  @Prop({ type: String, required: true, enum: VehicleType })
    vehicleType: VehicleType;

  @Prop({ type: String, required: true })
    vehicleMake: string;

  @Prop({ type: String, required: true })
    vehicleModel: string;

  @Prop({ type: String, default: VehicleStatus.AVAILABLE, enum: VehicleStatus })
    status: VehicleStatus;
}

export type VehicleDocument = Document & Vehicle;

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
