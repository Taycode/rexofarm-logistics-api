import * as bcrypt from 'bcryptjs';

import { Types, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { User } from '@v1/users/schemas/users.schema';
import { InjectConnection } from '@nestjs/mongoose';
import SignUpDto from '@v1/users/dto/controller/sign-up.dto';
import { DriversService } from '@v1/drivers/drivers.service';
import UsersRepository from './users.repository';
import UpdateUserDto from './dto/update-user.dto';

@Injectable()
export default class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly driversService: DriversService,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  public async create(user: SignUpDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const session = await this.connection.startSession();
    let createdUserAndDriver;
    await session.withTransaction(async (txn) => {
      const createdUser = await this.usersRepository.createWithTransaction({
        password: hashedPassword,
        email: user.email,
      }, txn);
      const driver = await this.driversService.createDriver({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      }, createdUser, txn);
      await txn.commitTransaction();
      createdUserAndDriver = { user: createdUser, driver };
    });
    await session.endSession();
    if (createdUserAndDriver) return createdUserAndDriver;
    throw new Error('Could not create user');
  }

  public update(
    id: Types.ObjectId,
    data: UpdateUserDto,
  ): Promise<User | null> {
    return this.usersRepository.updateById(id, data);
  }
}
