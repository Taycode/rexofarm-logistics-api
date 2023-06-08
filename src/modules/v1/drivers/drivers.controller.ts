import {
  Body, Controller, HttpException, HttpStatus, Patch, Req,
} from '@nestjs/common';
import { DriversService } from '@v1/drivers/drivers.service';
import { UpdateDriverCtrlDto, UpdateDriverNextOfKinCtrlDto } from '@v1/drivers/dto/controller/update-driver-ctrl.dto';
import { ApiTags } from '@nestjs/swagger';
import { CustomRequest } from '../../../types/request.type';

@Controller('drivers')
@ApiTags('Driver')
export class DriversController {
  constructor(
    private readonly driversService: DriversService,
  ) {}

  @Patch('profile')
  async updateDriverProfile(@Body() updatePayload: UpdateDriverCtrlDto, @Req() req: CustomRequest) {
    const { user } = req;
    const updatedDriver = await this.driversService.updateDriverWithUser(updatePayload, user);
    if (!updatedDriver) throw new HttpException('Driver could not be updated', HttpStatus.BAD_REQUEST);
    return { message: 'Driver updated successfully', data: updatedDriver };
  }

  @Patch('next-of-kin')
  async updateDriverNextOfKin(@Body() updatePayload: UpdateDriverNextOfKinCtrlDto, @Req() req: CustomRequest) {
    const { user } = req;
    const updatedDriver = await this.driversService.updateDriverNextOfKin(updatePayload, user);
    if (!updatedDriver) throw new HttpException('Driver could not be updated', HttpStatus.BAD_REQUEST);
    return { message: 'Driver updated successfully', data: updatedDriver };
  }
}
