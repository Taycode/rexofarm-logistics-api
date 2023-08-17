import { DeliveryStatus } from '@v1/delivery/enums/delivery.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeliveryStatusDto {
  @ApiProperty({ type: String, enum: DeliveryStatus })
  	status: DeliveryStatus;
}
