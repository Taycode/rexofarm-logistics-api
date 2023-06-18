import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleImage, VehicleImageDocument } from '@v1/vehicle/schema/vehicle-images.schema';
import { BaseRepository } from '../../../../common/repositories/base.repository';

@Injectable()
export class VehicleImageRepository extends BaseRepository<VehicleImageDocument> {
  constructor(@InjectModel(VehicleImage.name) private readonly vehicleImageModel: Model<VehicleImageDocument>) {
    super(vehicleImageModel);
  }
}
