import { Delivery } from '@v1/delivery/schemas/delivery.schema';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';

export class DeliveryEntity extends Delivery {
  @ApiProperty({ type: String })
    driver: Driver;

  @ApiProperty({ type: String })
    vehicle: Vehicle;
}
