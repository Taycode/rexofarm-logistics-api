import { ApiProperty } from '@nestjs/swagger';

class CreateDeliveryItemDto {
  item: string;

  quantity: number;
}
export class CreateDeliveryDto {
  orderId: string;

  pickupLocation: string;

  destination: string;

  buyer: string;

  seller: string;

  items: CreateDeliveryItemDto[];
}

class MockCreateDeliveryItemDto {
  @ApiProperty({ type: String })
    item: string;

  @ApiProperty({ type: Number, minimum: 1 })
    quantity: number;
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

  @ApiProperty({ isArray: true, type: MockCreateDeliveryItemDto })
    items: MockCreateDeliveryItemDto[];
}
