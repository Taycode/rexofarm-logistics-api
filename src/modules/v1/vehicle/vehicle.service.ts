import { Injectable } from '@nestjs/common';
import { VehicleImageRepository } from '@v1/vehicle/repositories/vehicle-image.repository';
import { VehicleRepository } from '@v1/vehicle/repositories/vehicle.repository';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { CreateVehicleDto } from '@v1/vehicle/dto/create-vehicle.dto';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import { CloudinaryService } from '@v1/cloudinary/cloudinary.service';
import { Express } from 'express';
import { VehicleType } from "@v1/vehicle/enums/vehicle.enum";

@Injectable()
export class VehicleService {
	constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly vehicleImageRepository: VehicleImageRepository,
    private readonly cloudinaryService: CloudinaryService,
	) {}

	async createVehicle(payload: CreateVehicleDto, driver: Driver): Promise<Vehicle> {
		return this.vehicleRepository.create({ ...payload, driver });
	}

	async fetchVehicleByType(type: VehicleType) {
		return this.vehicleRepository.find({ vehicleType: type })
	}

	async uploadVehicleImage(file: Express.Multer.File, vehicle: Vehicle) {
		const cloudinaryUpload = await this.cloudinaryService.uploadImage(file);
		return this.vehicleImageRepository.create({
			url: cloudinaryUpload.secure_url,
			publicId: cloudinaryUpload.public_id,
			vehicle,
		});
	}

	async uploadMultipleVehicleImage(files: Express.Multer.File[], vehicle: Vehicle) {
		return files.map((_) => this.uploadVehicleImage(_, vehicle));
	}

	async fetchDriverVehicles(driver: Driver) {
		return this.vehicleRepository.find({ driver });
	}

	async fetchOneDriverVehicle(driver: Driver, vehicleId: string) {
		return this.vehicleRepository.findOne({ driver, _id: vehicleId });
	}

	async deleteOneDriverVehicle(driver: Driver, vehicleId: string) {
		return this.vehicleRepository.deleteOne({ driver, _id: vehicleId });
	}

	async fetchVehicleImages(vehicle: Vehicle) {
		return this.vehicleImageRepository.find({ vehicle });
	}

	async fetchRandomVehicles() {
		return this.vehicleRepository.find({});
	}
}
