import { Driver } from '@v1/drivers/schemas/driver.schema';

export type UpdateDriversDto = Omit<Partial<Driver>, 'user'>

export type UpdateDriverNextOfKinDto = UpdateDriversDto['nextOfKin'];
