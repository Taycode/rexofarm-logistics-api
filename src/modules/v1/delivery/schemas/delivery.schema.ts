import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import mongoose, { Document } from 'mongoose';
import { Type } from 'class-transformer';
import { DeliveryStatus } from '@v1/delivery/enums/delivery.enum';

@Schema({ _id: false })
export class DeliveryItem {
  @Prop({ type: String })
    item: string;

  @Prop({ type: Number })
    quantity: number;
}

export const DeliveryItemSchema = SchemaFactory.createForClass(DeliveryItem);

@Schema({ timestamps: true })
export class Delivery {
  _id: string;

  @Prop({ type: String, required: true })
    orderId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Driver.name, required: false })
  @Type(() => Driver)
    driver: Driver;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Vehicle.name, required: false })
  @Type(() => Vehicle)
    vehicle: Vehicle;

  @Prop({ type: String, enum: DeliveryStatus, default: DeliveryStatus.UNASSIGNED })
    status: DeliveryStatus;

  @Prop({ type: Date, required: false })
    deliveredAt: Date;

  @Prop({ type: String, required: true })
    pickupLocation: string;

  @Prop({ type: String, required: true })
    destination: string;

  @Prop({ type: String, required: true })
    buyer: string;

  @Prop({ type: String, required: true })
    seller: string;

  @Prop({ type: [DeliveryItemSchema] })
    items: DeliveryItem[];
}

export type DeliveryDocument = Document & Delivery;

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
