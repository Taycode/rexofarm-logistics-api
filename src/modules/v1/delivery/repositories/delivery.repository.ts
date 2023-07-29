import { Injectable } from '@nestjs/common';
import { Delivery, DeliveryDocument } from '@v1/delivery/schemas/delivery.schema';
import { ClientSession, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDeliveryDto } from '@v1/delivery/dto/create-delivery.dto';
import { BaseRepository } from '../../../../common/repositories/base.repository';

@Injectable()
export class DeliveryRepository extends BaseRepository<DeliveryDocument> {
  constructor(@InjectModel(Delivery.name) private readonly deliveryModel: Model<DeliveryDocument>) {
    super(deliveryModel);
  }

  async create(payload: CreateDeliveryDto, session?: ClientSession): Promise<Delivery> {
    return super.create(payload, session);
  }
}
