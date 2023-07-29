import { Injectable } from '@nestjs/common';
import { PickupRequest, PickupRequestDocument } from '@v1/delivery/schemas/pickup-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CreatePickupRequestDto } from '@v1/delivery/dto/create-pickup-request.dto';
import { BaseRepository } from '../../../../common/repositories/base.repository';

@Injectable()
export class PickupRequestRepository extends BaseRepository<PickupRequestDocument> {
  constructor(@InjectModel(PickupRequest.name) private readonly pickupRequestModel: Model<PickupRequestDocument>) {
    super(pickupRequestModel);
  }

  async create(payload: CreatePickupRequestDto[], session?: ClientSession): Promise<PickupRequest> {
    return super.create(payload, session);
  }
}
