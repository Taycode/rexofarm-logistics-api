import {
  Body, Controller, HttpException, HttpStatus, Patch, Req, UseGuards,
} from '@nestjs/common';
import { DriversService } from '@v1/drivers/drivers.service';
import { UpdateDriverCtrlDto, UpdateDriverNextOfKinCtrlDto } from '@v1/drivers/dto/controller/update-driver-ctrl.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from '@v1/auth/guards/jwt.guard';
import { CustomRequest } from '../../../types/request.type';

@Controller()
@ApiTags('Driver')
export class DriversController {
  constructor(
    private readonly driversService: DriversService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Patch('profile')
  async updateDriverProfile(@Body() updatePayload: UpdateDriverCtrlDto, @Req() req: CustomRequest) {
    const { user } = req;
    const updatedDriver = await this.driversService.updateDriverWithUser(updatePayload, user);
    if (!updatedDriver) throw new HttpException('Driver could not be updated', HttpStatus.BAD_REQUEST);
    return { message: 'Driver updated successfully', data: updatedDriver };
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Patch('next-of-kin')
  async updateDriverNextOfKin(@Body() updatePayload: UpdateDriverNextOfKinCtrlDto, @Req() req: CustomRequest) {
    const { user } = req;
    const updatedDriver = await this.driversService.updateDriverNextOfKin(updatePayload, user);
    if (!updatedDriver) throw new HttpException('Driver could not be updated', HttpStatus.BAD_REQUEST);
    return { message: 'Driver updated successfully', data: updatedDriver };
  }
}
