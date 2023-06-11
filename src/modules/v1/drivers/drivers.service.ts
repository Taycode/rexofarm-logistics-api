import { DriversRepository } from '@v1/drivers/drivers.repository';
import { CreateDriversDto } from '@v1/drivers/dto/create-drivers.dto';
import { ClientSession } from 'mongoose';
import { User } from '@v1/users/schemas/users.schema';
import { Injectable } from '@nestjs/common';
import { UpdateDriverNextOfKinDto, UpdateDriversDto } from '@v1/drivers/dto/update-drivers.dto';

@Injectable()

export class DriversService {
  constructor(
    private readonly driverRepository: DriversRepository,
  ) {}

  public async createDriver(payload: CreateDriversDto, user: User, session: ClientSession) {
    return this.driverRepository.createWithTransaction(payload, user, session);
  }

  public async updateDriverWithUser(payload: UpdateDriversDto, user: User) {
    return this.driverRepository.updateWithCondition({ user }, payload);
  }

  public async updateDriverNextOfKin(payload: UpdateDriverNextOfKinDto, user: User) {
    return this.driverRepository.updateWithCondition({ user }, { nextOfKin: payload });
  }
}
