import { Types } from 'mongoose';

export interface UserInterface {
  readonly _id: Types.ObjectId;
  readonly email: string;
}
