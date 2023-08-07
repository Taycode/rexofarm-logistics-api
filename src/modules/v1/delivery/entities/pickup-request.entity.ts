import { PickupRequest } from '@v1/delivery/schemas/pickup-request.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { Vehicle } from '@v1/vehicle/schema/vehicle.schema';
import { Delivery } from '@v1/delivery/schemas/delivery.schema';
import { DeliveryEntity } from '@v1/delivery/entities/delivery.entity';

export class PickupRequestEntity extends PickupRequest {
  @ApiProperty({ type: String })
    driver: Driver;

  @ApiProperty({ type: String })
    vehicle: Vehicle;

  @ApiProperty({ type: String })
    delivery: Delivery;
}

export class PickupRequestWithDeliveryEntity extends PickupRequest {
  @ApiProperty({ type: String })
    driver: Driver;

  @ApiProperty({ type: String })
    vehicle: Vehicle;

  @ApiProperty({ type: DeliveryEntity })
    delivery: Delivery;
}
