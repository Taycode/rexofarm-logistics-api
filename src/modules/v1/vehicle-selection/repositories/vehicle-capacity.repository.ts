import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../../../common/repositories/base.repository";
import { VehicleCapacity, VehicleCapacityDocument } from "@v1/vehicle-selection/schemas/vehicle-capacity.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class VehicleCapacityRepository extends BaseRepository<VehicleCapacityDocument> {
	constructor(@InjectModel(VehicleCapacity.name) protected readonly vehicleCapacityModel: Model<VehicleCapacityDocument>) {
		super(vehicleCapacityModel);
	}
}
