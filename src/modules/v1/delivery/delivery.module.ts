import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Delivery, DeliverySchema } from '@v1/delivery/schemas/delivery.schema';
import { DeliveryRepository } from '@v1/delivery/repositories/delivery.repository';
import { DeliveryService } from '@v1/delivery/delivery.service';
import { BullModule } from '@nestjs/bull';
import { DeliveryController } from '@v1/delivery/delivery.controller';
import { PickupRequestRepository } from '@v1/delivery/repositories/pickup-request.repository';
import { PickupRequest, PickupRequestSchema } from '@v1/delivery/schemas/pickup-request.schema';
import { DeliveryConsumer } from '@v1/delivery/delivery.consumer';
import { VehicleModule } from '@v1/vehicle/vehicle.module';

@Module({
  controllers: [DeliveryController],
  imports: [MongooseModule.forFeature([{
    schema: DeliverySchema,
    name: Delivery.name,
  },
  {
    schema: PickupRequestSchema,
    name: PickupRequest.name,
  }]),
  BullModule.registerQueue({
    name: 'placed-orders',
  }),
    VehicleModule,
  ],
  providers: [
    PickupRequestRepository,
    DeliveryRepository,
    DeliveryService,
    DeliveryConsumer,
  ],
})
export class DeliveryModule {}
