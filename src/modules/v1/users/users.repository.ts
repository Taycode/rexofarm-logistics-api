import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { RolesEnum } from '@decorators/roles.decorator';

import CreateUserDto from '@v1/auth/dto/create-user.dto';
import { UserDocument, User } from '@v1/users/schemas/users.schema';

import { ClientSession } from 'mongodb';
import UpdateUserDto from './dto/update-user.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

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
    ).lean();
  }

  public async getVerifiedAdminByEmail(email: string): Promise<User | null> {
    return this.usersModel.findOne({
      email,
      roles: { $in: RolesEnum.ADMIN },
      verified: true,
    }).lean();
  }
}
