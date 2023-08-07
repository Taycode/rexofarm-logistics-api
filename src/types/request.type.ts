import { Request } from 'express';
import { UserWithDriver } from '@v1/users/types/user.type';

export type CustomRequest = Request & { user: UserWithDriver }
