import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Delivery, DeliverySchema } from '@v1/delivery/schemas/delivery.schema';

@Module({
  imports: [MongooseModule.forFeature([{
    schema: DeliverySchema,
    name: Delivery.name,
  }])],
})
export class DeliveryModule {}
