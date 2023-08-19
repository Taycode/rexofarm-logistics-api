import { ApiProperty } from '@nestjs/swagger';
import { EachProductEntity } from "@v1/vehicle-selection/entities/product-orders.entity";

class CreateDeliveryItemDto extends EachProductEntity {
	itemName: string;
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
  	itemName: string;

  @ApiProperty({ type: Number, minimum: 1 })
  	quantity: number;

	@ApiProperty({ type: Number })
		height: number;

	@ApiProperty({ type: Number })
		width: number;

	@ApiProperty({ type: Number })
		length: number;

	@ApiProperty({ type: Number })
		weight: number;
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
