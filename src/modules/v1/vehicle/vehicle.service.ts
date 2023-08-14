import { Injectable } from '@nestjs/common';
import { VehicleImageRepository } from '@v1/vehicle/repositories/vehicle-image.repository';
import { VehicleRepository } from '@v1/vehicle/repositories/vehicle.repository';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { CreateVehicleDto } from '@v1/vehicle/dto/create-vehicle.dto';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import { CloudinaryService } from '@v1/cloudinary/cloudinary.service';
import { Express } from 'express';
import UsersRepository from '@v1/users/repositories/users.repository';
import { KycUploadStatusEnum } from '@v1/users/enums/kyc-upload-status.enum';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly vehicleImageRepository: VehicleImageRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userRepository: UsersRepository,
  ) {}

  async createVehicle(payload: CreateVehicleDto, driver: Driver): Promise<Vehicle> {
    await this.userRepository.updateKycStatus(KycUploadStatusEnum.VEHICLE_DETAILS, driver.user._id);
    return this.vehicleRepository.create({ ...payload, driver });
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
    await this.userRepository.updateKycStatus(KycUploadStatusEnum.VEHICLE_IMAGES, vehicle.driver.user._id);
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
