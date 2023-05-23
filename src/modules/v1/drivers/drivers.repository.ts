import { InjectModel } from '@nestjs/mongoose';
import { Driver, DriverDocument } from '@v1/drivers/schemas/driver.schema';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { CreateDriversDto } from '@v1/drivers/dto/create-drivers.dto';
import { User } from '@v1/users/schemas/users.schema';
import { Injectable } from '@nestjs/common';
import { UpdateDriversDto } from '@v1/drivers/dto/update-drivers.dto';

@Injectable()

export class DriversRepository {
  constructor(@InjectModel(Driver.name) private driversModel: Model<DriverDocument>) {
  }

  public async createWithTransaction(payload: CreateDriversDto, user: User, session: ClientSession): Promise<Driver> {
    const createdDriver = await this.driversModel.create([{ ...payload, user }], { session });
    return createdDriver[0];
  }

  public async update(driverId: string, payload: UpdateDriversDto) {
    return this.driversModel.findByIdAndUpdate(driverId, payload);
  }

  public async updateWithCondition(condition: FilterQuery<DriverDocument>, payload: UpdateDriversDto) {
    return this.driversModel.findOneAndUpdate(condition, payload, { new: true, omitUndefined: true });
  }
}
