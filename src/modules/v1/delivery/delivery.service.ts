import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from '@v1/delivery/dto/create-delivery.dto';
import { DeliveryRepository } from '@v1/delivery/repositories/delivery.repository';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { DeliveryStatus } from '@v1/delivery/enums/delivery.enum';
import { Delivery } from '@v1/delivery/schemas/delivery.schema';
import { DriverPickupRequestDto } from '@v1/delivery/dto/send-pickup-request.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { PickupRequestRepository } from '@v1/delivery/repositories/pickup-request.repository';
import { CreatePickupRequestDto } from '@v1/delivery/dto/create-pickup-request.dto';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly deliveryRepository: DeliveryRepository,
    private readonly pickupRequestRepository: PickupRequestRepository,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  DELIVERY_STATUS_WEIGHT = {
    [DeliveryStatus.NEW_SHIPMENT]: 1,
    [DeliveryStatus.ONGOING]: 2,
    [DeliveryStatus.DELIVERED]: 3,
  };

  async sendPickupRequest(payload: CreateDeliveryDto, selectedDrivers: DriverPickupRequestDto[]) {
    const session = await this.connection.startSession();
    await session.withTransaction((async (txn) => {
      // Create Delivery
      const delivery = await this.deliveryRepository.create({
        ...payload,
      }, txn);

      // Prepare Pickup requests
      const pickupRequestPayload = selectedDrivers.map((each) => {
        return {
          ...each,
          orderId: payload.orderId,
          delivery,
        } as CreatePickupRequestDto;
      });

      // Send Pickup Requests
      await this.pickupRequestRepository.create(pickupRequestPayload, txn);
      await txn.commitTransaction();
    }));
    await session.endSession();
  }

  async fetchDriverDeliveries(driver: Driver) {
    return this.deliveryRepository.find({ driver });
  }

  async fetchOneDriverDelivery(driver: Driver, deliveryId: string) {
    return this.deliveryRepository.findOne({ driver, _id: deliveryId });
  }

  async updateDeliveryStatus(driver: Driver, delivery: Delivery, newStatus: DeliveryStatus) {
    const newStatusWeight = this.DELIVERY_STATUS_WEIGHT[newStatus];
    const oldStatusWeight = this.DELIVERY_STATUS_WEIGHT[delivery.status];
    if (newStatusWeight > oldStatusWeight) {
      return this.deliveryRepository.findOneAndUpdate({ driver, _id: delivery._id }, {
        status: newStatus,
      });
    }
    throw new Error('Could not update delivery status');
  }
}
