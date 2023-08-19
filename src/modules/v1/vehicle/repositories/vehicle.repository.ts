import { Injectable } from '@nestjs/common';
import { Vehicle, VehicleDocument } from '@v1/vehicle/schema/vehicle.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../../common/repositories/base.repository';

@Injectable()
export class VehicleRepository extends BaseRepository<VehicleDocument> {
	constructor(@InjectModel(Vehicle.name) readonly vehicleModel: Model<VehicleDocument>) {
		super(vehicleModel);
	}
}
