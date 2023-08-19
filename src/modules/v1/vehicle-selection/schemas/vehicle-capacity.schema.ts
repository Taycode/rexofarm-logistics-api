import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { VehicleType } from '@v1/vehicle/enums/vehicle.enum';
import { Document } from 'mongoose';


@Schema()
export class VehicleCapacity {
	@Prop({ required: true, type: String, enum: VehicleType })
		type: VehicleType;

	@Prop({ type: Number, required: true })
		maximumLength: number;

	@Prop({ type: Number, required: true })
		maximumWidth: number;

	@Prop({ type: Number, required: true })
		maximumHeight: number;

	@Prop({ type: Number, required: true })
		maximumWeight: number;
}


export type VehicleCapacityDocument = Document & VehicleCapacity;

export const VehicleCapacitySchema = SchemaFactory.createForClass(VehicleCapacity);
