import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import { Driver } from '@v1/drivers/schemas/driver.schema';

export class CreateDeliveryDto {
  orderId: string;

  vehicle: Vehicle;

  driver: Driver;
}
