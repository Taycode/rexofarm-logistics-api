import { Delivery } from '@v1/delivery/schemas/delivery.schema';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';

export class CreatePickupRequestDto {
  orderId: string;

  driver: Driver;

  vehicle: Vehicle;

  delivery: Delivery;
}
