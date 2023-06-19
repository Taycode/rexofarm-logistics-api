import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from '@v1/delivery/dto/create-delivery.dto';
import { DeliveryRepository } from '@v1/delivery/delivery.repository';

@Injectable()
export class DeliveryService {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async initiateDelivery(payload: CreateDeliveryDto) {
    return this.deliveryRepository.create(payload);
  }
}
