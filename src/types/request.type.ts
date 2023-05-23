import { User } from '@v1/users/schemas/users.schema';
import { Request } from 'express';

export type CustomRequest = Request & { user: User }
