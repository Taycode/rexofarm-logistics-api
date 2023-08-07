import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import { Driver } from '@v1/drivers/schemas/driver.schema';

export class DriverPickupRequestDto {
  driver: Driver; // The ID of the driver

  vehicle: Vehicle; // The ID of the vehicle
}
