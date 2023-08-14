import { DriversRepository } from '@v1/drivers/drivers.repository';
import { CreateDriversDto } from '@v1/drivers/dto/create-drivers.dto';
import { ClientSession } from 'mongoose';
import { User } from '@v1/users/schemas/users.schema';
import { Injectable } from '@nestjs/common';
import { UpdateDriverNextOfKinDto, UpdateDriversDto } from '@v1/drivers/dto/update-drivers.dto';
import UsersRepository from '@v1/users/repositories/users.repository';
import { KycUploadStatusEnum } from '@v1/users/enums/kyc-upload-status.enum';

@Injectable()

export class DriversService {
  constructor(
    private readonly driverRepository: DriversRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  public async createDriver(payload: CreateDriversDto, user: User, session: ClientSession) {
    return this.driverRepository.createWithTransaction(payload, user, session);
  }

  public async updateDriverWithUser(payload: UpdateDriversDto, user: User) {
    await this.userRepository.updateKycStatus(KycUploadStatusEnum.DRIVER_ADDRESS, user._id);
    return this.driverRepository.updateWithCondition({ user }, payload);
  }

  public async updateDriverNextOfKin(payload: UpdateDriverNextOfKinDto, user: User) {
    await this.userRepository.updateKycStatus(KycUploadStatusEnum.NEXT_OF_KIN, user._id);
    return this.driverRepository.updateWithCondition({ user }, { nextOfKin: payload });
  }
}
