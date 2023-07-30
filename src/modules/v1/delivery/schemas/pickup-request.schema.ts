import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PickupRequestStatus } from '@v1/delivery/enums/pickup-request.enum';
import mongoose, { Document } from 'mongoose';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { Type } from 'class-transformer';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import { Delivery } from '@v1/delivery/schemas/delivery.schema';

@Schema({ timestamps: true })
export class PickupRequest {
  _id: string;

  @Prop({ type: String, default: PickupRequestStatus.AWAITING_RESPONSE })
    status: PickupRequestStatus;

  @Prop({ type: String, required: true })
    orderId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Driver.name, required: true })
  @Type(() => Driver)
    driver: Driver;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Vehicle.name, required: true })
  @Type(() => Vehicle)
    vehicle: Vehicle;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Delivery.name, required: true })
  @Type(() => Vehicle)
    delivery: Delivery;
}

export type PickupRequestDocument = Document & PickupRequest;

export const PickupRequestSchema = SchemaFactory.createForClass(PickupRequest);
