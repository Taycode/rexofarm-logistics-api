import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliveryDto {
  orderId: string;

  pickupLocation: string;

  destination: string;

  buyer: string;

  seller: string;
}

export class MockCreateDeliveryDto {
  @ApiProperty({ type: String, required: true })
    orderId: string;

  @ApiProperty({ type: String, required: true })
    pickupLocation: string;

  @ApiProperty({ type: String, required: true })
    destination: string;

  @ApiProperty({ type: String, required: true })
    buyer: string;

  @ApiProperty({ type: String, required: true })
    seller: string;
}
