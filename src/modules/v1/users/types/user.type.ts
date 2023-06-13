import { User } from '@v1/users/schemas/users.schema';
import { Driver } from '@v1/drivers/schemas/driver.schema';

export type UserWithDriver = User & { driver: Driver };
