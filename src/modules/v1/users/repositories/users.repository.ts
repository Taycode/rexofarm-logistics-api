import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { RolesEnum } from '@decorators/roles.decorator';

import CreateUserDto from '@v1/auth/dto/create-user.dto';
import { UserDocument, User } from '@v1/users/schemas/users.schema';

import { ClientSession, ObjectId } from 'mongodb';
import { UserWithDriver } from '@v1/users/types/user.type';
import UpdateUserDto from '../dto/update-user.dto';
import { BaseRepository } from '../../../../common/repositories/base.repository';

@Injectable()
export default class UsersRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
  ) {
    super(usersModel);
  }

  public async create(user: CreateUserDto): Promise<User> {
    return this.usersModel.create({
      ...user,
      verified: false,
    });
  }

  public async createWithTransaction(user: CreateUserDto, session: ClientSession): Promise<User> {
    const createdUser = await this.usersModel.create([{
      ...user,
      verified: false,
    }], { session });
    return createdUser[0];
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.usersModel.findOne({
      email,
    }).lean();
  }

  public async getById(id: Types.ObjectId): Promise<User | null> {
    return this.usersModel.findOne({
      _id: id,
    }, { password: 0 }).lean();
  }

  public async updateById(id: Types.ObjectId, data: UpdateUserDto): Promise<User | null> {
    return this.usersModel.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        projection: { password: 0 },
		new: true,
      },
    ).lean();
  }

  public async getVerifiedAdminByEmail(email: string): Promise<User | null> {
    return this.usersModel.findOne({
      email,
      roles: { $in: RolesEnum.ADMIN },
      verified: true,
    }).lean();
  }

  async fetchUserWithDriver(userId: string): Promise<UserWithDriver | null> {
    const userWithDriver = await this.usersModel.aggregate([
      {
        $match: { _id: new ObjectId(userId) }, // Match the user by ID
      },
      {
        $lookup: {
          from: 'drivers', // Name of the Driver collection
          localField: '_id',
          foreignField: 'user',
          as: 'driver',
        },
      },
      {
        $unwind: { path: '$driver', preserveNullAndEmptyArrays: true }, // Unwind the driver array
      },
    ]);

    if (userWithDriver.length === 0) {
      return null; // User not found
    }

    if (userWithDriver.length > 1) {
      throw new Error('Error while fetching user: one to one constraints failed'); // User not found
    }

    const singleUserWithDriver = userWithDriver[0];
    delete singleUserWithDriver.password;
    return singleUserWithDriver;
  }
}
