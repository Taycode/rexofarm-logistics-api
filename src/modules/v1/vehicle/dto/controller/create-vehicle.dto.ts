import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '@v1/vehicle/enums/vehicle.enum';

export class CreateVehicleRequestDto {
  @ApiProperty({ type: String, required: true, enum: VehicleType })
    vehicleType: string;

  @ApiProperty({ type: String, required: true })
    vehicleMake: string;

  @ApiProperty({ type: String, required: true })
    vehicleModel: string;

  @ApiProperty({ type: String, required: true })
    numberPlate: string;
}
