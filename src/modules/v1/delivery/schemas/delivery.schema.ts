import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import mongoose, { Document } from 'mongoose';
import { Type } from 'class-transformer';
import { DeliveryStatus } from '@v1/delivery/enums/delivery.enum';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class DeliveryItem {
  @ApiProperty()
  @Prop({ type: String })
    item: string;

  @ApiProperty()
  @Prop({ type: Number })
    quantity: number;
}

export const DeliveryItemSchema = SchemaFactory.createForClass(DeliveryItem);

@Schema({ timestamps: true })
export class Delivery {
  @ApiProperty()
    _id: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
    orderId: string;

  @ApiProperty({ type: () => Driver })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Driver.name, required: false })
  @Type(() => Driver)
    driver: Driver;

  @ApiProperty({ type: () => Vehicle })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Vehicle.name, required: false })
  @Type(() => Vehicle)
    vehicle: Vehicle;

  @ApiProperty({ enum: DeliveryStatus, default: DeliveryStatus.UNASSIGNED })
  @Prop({ type: String, enum: DeliveryStatus, default: DeliveryStatus.UNASSIGNED })
    status: DeliveryStatus;

  @ApiProperty()
  @Prop({ type: Date, required: false })
    deliveredAt: Date;

  @ApiProperty()
  @Prop({ type: String, required: true })
    pickupLocation: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
    destination: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
    buyer: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
    seller: string;

  @ApiProperty({ type: () => [DeliveryItem] })
  @Prop({ type: [DeliveryItemSchema] })
    items: DeliveryItem[];
}

export type DeliveryDocument = Document & Delivery;

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
