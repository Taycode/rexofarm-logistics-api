import {
	Body,
	Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards,
} from '@nestjs/common';
import { DeliveryService } from '@v1/delivery/delivery.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from '@v1/auth/guards/jwt.guard';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MockCreateDeliveryDto } from '@v1/delivery/dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from '@v1/delivery/dto/update-delivery-status.dto';
import { DeliveryEntity } from '@v1/delivery/entities/delivery.entity';
import { PickupRequestEntity, PickupRequestWithDeliveryEntity } from '@v1/delivery/entities/pickup-request.entity';
import { CustomRequest } from '../../../types/request.type';

@ApiTags('Delivery')
@Controller()
export class DeliveryController {
	constructor(
    private readonly deliveryService: DeliveryService,
    @InjectQueue('placed-orders') private readonly placedOrdersQueue: Queue,
	) {}

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiOkResponse({
  	description: 'Successful Delivery fetch',
  	type: [DeliveryEntity],
  })
  @Get('fetch')
	async fetchDeliveries(@Req() req: CustomRequest) {
		const { user } = req;
		return this.deliveryService.fetchDriverDeliveries(user.driver);
	}

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiOkResponse({
  	description: 'Successful Delivery fetch',
  	type: DeliveryEntity,
  })
  @Get('fetch/:deliveryId')
  async fetchOneDelivery(@Req() req: CustomRequest, @Param('deliveryId') deliveryId: string) {
  	const { user } = req;
  	const delivery = await this.deliveryService.fetchOneDriverDelivery(user.driver, deliveryId);
  	if (delivery) return delivery;
  	throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiOkResponse({
  	description: 'Successful Delivery fetch',
  	type: [PickupRequestEntity],
  })
  @Get('pickup-request/fetch')
  async fetchPickupRequests(@Req() req: CustomRequest) {
  	const { user } = req;
  	return this.deliveryService.fetchPickupRequests(user.driver);
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiOkResponse({
  	description: 'Successful Delivery fetch',
  	type: PickupRequestWithDeliveryEntity,
  })
  @Get('pickup-request/fetch/:pickupRequestId')
  async fetchOnePickupRequest(@Req() req: CustomRequest, @Param('pickupRequestId') pickupRequestId: string) {
  	const { user } = req;
  	const pickupRequest = await this.deliveryService.fetchOnePickupRequest(user.driver, pickupRequestId);
  	if (pickupRequest) return pickupRequest;
  	throw new HttpException('Pickup request not found', HttpStatus.NOT_FOUND);
  }

  @Post('mock-place-orders')
  async mockPlaceOrders(@Body() payload: MockCreateDeliveryDto) {
  	return this.deliveryService.initiatePickups(payload);
  	// return this.placedOrdersQueue.add(payload);
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiOkResponse({
  	description: 'Successful Delivery fetch',
  	type: DeliveryEntity,
  })
  @Post('/:deliveryId/update')
  async updateDeliveryStatus(
    @Req() req: CustomRequest,
    @Param('deliveryId') deliveryId: string,
    @Body() payload: UpdateDeliveryStatusDto,
  ) {
  	const { user } = req;
  	const delivery = await this.deliveryService.fetchOneDriverDelivery(
  		user.driver,
  		deliveryId,
  	);
  	if (!delivery) throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
  	const updatedDelivery = await this.deliveryService.updateDeliveryStatus(
  		user.driver,
  		delivery,
  		payload.status,
  	);
  	if (!updatedDelivery) throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
  	return updatedDelivery;
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Post('pickup-request/:pickupRequestId/accept')
  async acceptPickupRequest(
    @Req() req: CustomRequest,
    @Param('pickupRequestId') pickupRequestId: string,
  ) {
  	const { user } = req;
  	await this.deliveryService.acceptPickupRequest(user.driver, pickupRequestId);
  	return {
  		message: 'Pickup request accepted',
  	};
  }
}
