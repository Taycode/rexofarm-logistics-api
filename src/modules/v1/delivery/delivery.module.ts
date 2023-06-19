import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Delivery, DeliverySchema } from '@v1/delivery/schemas/delivery.schema';
import { DeliveryRepository } from '@v1/delivery/delivery.repository';
import { DeliveryService } from '@v1/delivery/delivery.service';

@Module({
  imports: [MongooseModule.forFeature([{
    schema: DeliverySchema,
    name: Delivery.name,
  }])],
  providers: [
    DeliveryRepository,
    DeliveryService,
  ],
})
export class DeliveryModule {}
