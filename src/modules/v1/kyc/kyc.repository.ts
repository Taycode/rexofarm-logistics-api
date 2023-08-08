import { KYC, KYCDocument } from '@v1/kyc/schema/kyc.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '@v1/users/schemas/users.schema';
import { CreateKycDto } from '@v1/kyc/dto/create-kyc.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class KYCRepository extends BaseRepository<KYCDocument> {
  constructor(@InjectModel(KYC.name) private readonly kycModel: Model<KYCDocument>) {
    super(kycModel);
  }

  public async createKyc(payload: CreateKycDto, user: User) {
    return this.kycModel.create({ ...payload, user });
  }
}
