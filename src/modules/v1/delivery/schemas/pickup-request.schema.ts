import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { Type } from 'class-transformer';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import { Delivery } from '@v1/delivery/schemas/delivery.schema';
import { PickupRequestStatus } from '@v1/delivery/enums/pickup-request.enum';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class PickupRequest {
  @ApiProperty()
  	_id: string;

  @ApiProperty({ default: PickupRequestStatus.AWAITING_RESPONSE, enum: PickupRequestStatus })
  @Prop({ type: String, default: PickupRequestStatus.AWAITING_RESPONSE, enum: PickupRequestStatus })
  	status: PickupRequestStatus;

  @ApiProperty()
  @Prop({ type: String, required: true })
  	orderId: string;

  @ApiProperty({ type: () => Driver })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Driver.name, required: true })
  @Type(() => Driver)
  	driver: Driver;

  @ApiProperty({ type: () => Vehicle })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Vehicle.name, required: true })
  @Type(() => Vehicle)
  	vehicle: Vehicle;

  @ApiProperty({ type: () => Delivery })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Delivery.name, required: true })
  @Type(() => Delivery)
  	delivery: Delivery;
}

export type PickupRequestDocument = PickupRequest & Document;

export const PickupRequestSchema = SchemaFactory.createForClass(PickupRequest);
