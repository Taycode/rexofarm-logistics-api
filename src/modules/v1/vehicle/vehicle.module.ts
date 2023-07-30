import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from '@v1/vehicle/schema/vehicle.schema';
import { VehicleImage, VehicleImageSchema } from '@v1/vehicle/schema/vehicle-images.schema';
import { VehicleController } from '@v1/vehicle/vehicle.controller';
import { VehicleService } from '@v1/vehicle/vehicle.service';
import { VehicleRepository } from '@v1/vehicle/repositories/vehicle.repository';
import { VehicleImageRepository } from '@v1/vehicle/repositories/vehicle-image.repository';
import { CloudinaryModule } from '@v1/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      schema: VehicleSchema,
      name: Vehicle.name,
    },
    {
      schema: VehicleImageSchema,
      name: VehicleImage.name,
    },
    ]),
    CloudinaryModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleRepository, VehicleImageRepository],
  exports: [VehicleService],
})
export class VehicleModule {}
