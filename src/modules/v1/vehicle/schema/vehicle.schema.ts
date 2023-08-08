import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { VehicleStatus, VehicleType } from '@v1/vehicle/enums/vehicle.enum';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Vehicle {
  @ApiProperty({ type: () => Driver })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Driver.name, required: true })
  @Type(() => Driver)
    driver: Driver;

  @ApiProperty()
  @Prop({ type: String, required: true })
    numberPlate: string;

  @ApiProperty({ enum: VehicleType })
  @Prop({ type: String, required: true, enum: VehicleType })
    vehicleType: VehicleType;

  @ApiProperty()
  @Prop({ type: String, required: true })
    vehicleMake: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
    vehicleModel: string;

  @ApiProperty({ enum: VehicleStatus, default: VehicleStatus.AVAILABLE })
  @Prop({ type: String, default: VehicleStatus.AVAILABLE, enum: VehicleStatus })
    status: VehicleStatus;
}

export type VehicleDocument = Vehicle & Document;

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
