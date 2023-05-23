import {
  Body, Controller, HttpException, HttpStatus, Req,
} from '@nestjs/common';
import { DriversService } from '@v1/drivers/drivers.service';
import { UpdateDriverCtrlDto, UpdateDriverNextOfKinCtrlDto } from '@v1/drivers/dto/controller/update-driver-ctrl.dto';
import { CustomRequest } from '../../../types/request.type';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  async updateDriverProfile(@Body() updatePayload: UpdateDriverCtrlDto, @Req() req: CustomRequest) {
    const { user } = req;
    const updatedDriver = await this.driversService.updateDriverWithUser(updatePayload, user);
    if (!updatedDriver) throw new HttpException('Driver could not be updated', HttpStatus.BAD_REQUEST);
    return { message: 'Driver updated successfully', data: updatedDriver };
  }

  async updateDriverNextOfKin(@Body() updatePayload: UpdateDriverNextOfKinCtrlDto, @Req() req: CustomRequest) {
    const { user } = req;
    const updatedDriver = await this.driversService.updateDriverNextOfKin(updatePayload, user);
    if (!updatedDriver) throw new HttpException('Driver could not be updated', HttpStatus.BAD_REQUEST);
    return { message: 'Driver updated successfully', data: updatedDriver };
  }
}
