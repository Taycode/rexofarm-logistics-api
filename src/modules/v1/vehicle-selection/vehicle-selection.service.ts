import { Injectable } from "@nestjs/common";
import { VehicleCapacityRepository } from "@v1/vehicle-selection/repositories/vehicle-capacity.repository";
import { EachProductEntity } from "@v1/vehicle-selection/entities/product-orders.entity";
import { VehicleCapacity } from "@v1/vehicle-selection/schemas/vehicle-capacity.schema";
import { VehicleService } from "@v1/vehicle/vehicle.service";

@Injectable()
export class VehicleSelectionService {
	constructor(
		private readonly vehicleCapacityRepository: VehicleCapacityRepository,
		private readonly vehicleService: VehicleService,
	) {}

	private async fetchVehicleCapacities() {
		return this.vehicleCapacityRepository.find({});
	}

	private sortByVolume(products: EachProductEntity[]): EachProductEntity[] {
		return products.slice().sort((a, b) => {
			const volumeA = a.height * a.width * a.length * a.quantity;
			const volumeB = b.height * b.width * b.length * b.quantity;
			return volumeB - volumeA;
		});
	}

	calculateVolumeOfVehicle(vehicle: VehicleCapacity): number {
		return vehicle.maximumLength * vehicle.maximumWidth * vehicle.maximumHeight;
	}

	findSmallestVehicleCapacity(vehicles: VehicleCapacity[]): VehicleCapacity {
		return vehicles.reduce((smallestCapacity, currentCapacity) => {
			const smallestVolume = this.calculateVolumeOfVehicle(smallestCapacity);
			const currentVolume = this.calculateVolumeOfVehicle(currentCapacity);

			if (currentVolume < smallestVolume) {
				return currentCapacity;
			} else {
				return smallestCapacity;
			}
		});
	}

	private canProductsFit(products: EachProductEntity[], vehicleCapacity: VehicleCapacity): boolean {
		const sortedProducts = this.sortByVolume(products);
		const bins: { width: number; length: number; height: number }[] = [
			{ width: vehicleCapacity.maximumWidth, length: vehicleCapacity.maximumLength, height: vehicleCapacity.maximumHeight }
		];

		for (const product of sortedProducts) {
			let fitted = false;

			for (const bin of bins) {
				if (
					product.width <= bin.width &&
					product.length <= bin.length &&
					product.height <= bin.height
				) {
					bin.width -= product.width;
					bin.length -= product.length;
					bin.height -= product.height;
					fitted = true;
					break;
				}
			}

			if (!fitted) {
				return false;
			}
		}

		return true;
	}

	private async selectVehicleType(products: EachProductEntity[]) {
		const vehicleTypes = await this.fetchVehicleCapacities();
		const filteredVehicleTypes = vehicleTypes.filter(
			(eachVehicle) => this.canProductsFit(products, eachVehicle)
		)
		if (!filteredVehicleTypes.length) throw new Error('Could not find vehicle that fits');
		return this.findSmallestVehicleCapacity(filteredVehicleTypes);
	}

	public async fetchVehiclesFit(products: EachProductEntity[]) {
		const fitVehicleType = await this.selectVehicleType(products);
		const fitVehicles = await this.vehicleService.fetchVehicleByType(fitVehicleType.type);
		// ToDo: Further enhance this system
		return fitVehicles;
	}
}
