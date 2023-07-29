import {
  Controller, Get, HttpException, HttpStatus, Param, Req, UseGuards,
} from '@nestjs/common';
import { DeliveryService } from '@v1/delivery/delivery.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from '@v1/auth/guards/jwt.guard';
import { CustomRequest } from '../../../types/request.type';

@ApiTags('Delivery')
@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get('fetch')
  async fetchDeliveries(@Req() req: CustomRequest) {
    const { user } = req;
    return this.deliveryService.fetchDriverDeliveries(user.driver);
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get('fetch/:deliveryId')
  async fetchOneDelivery(@Req() req: CustomRequest, @Param('deliveryId') deliveryId: string) {
    const { user } = req;
    const delivery = await this.deliveryService.fetchOneDriverDelivery(user.driver, deliveryId);
    if (delivery) return delivery;
    throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
  }
}
