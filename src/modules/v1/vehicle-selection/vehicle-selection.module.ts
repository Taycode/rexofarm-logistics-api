import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VehicleCapacity, VehicleCapacitySchema } from "@v1/vehicle-selection/schemas/vehicle-capacity.schema";
import { VehicleCapacityRepository } from "@v1/vehicle-selection/repositories/vehicle-capacity.repository";
import { VehicleSelectionService } from "@v1/vehicle-selection/vehicle-selection.service";
import { VehicleModule } from "@v1/vehicle/vehicle.module";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ schema: VehicleCapacitySchema, name: VehicleCapacity.name },
		]),
		VehicleModule,
	],
	providers: [VehicleCapacityRepository, VehicleSelectionService],
	exports: [VehicleSelectionService],
})
export class VehicleSelectionModule {}
