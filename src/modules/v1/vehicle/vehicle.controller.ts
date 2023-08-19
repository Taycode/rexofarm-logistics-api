import {
	Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { VehicleService } from '@v1/vehicle/vehicle.service';
import { CreateVehicleRequestDto } from '@v1/vehicle/dto/controller/create-vehicle.dto';
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
	ApiBearerAuth, ApiBody, ApiConsumes, ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from '@v1/auth/guards/jwt.guard';
import { UploadVehicleImagesRequestDto } from '@v1/vehicle/dto/controller/upload-vehicle-images.dto';
import { CustomRequest } from '../../../types/request.type';

@ApiTags('Vehicle')
@Controller()
export class VehicleController {
	constructor(
    private readonly vehicleService: VehicleService,
	) {}

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Post('create')
	async create(@Body() payload: CreateVehicleRequestDto, @Req() req: CustomRequest) {
		const { user } = req;
		const createdVehicle = await this.vehicleService.createVehicle(payload, user.driver);
		return { message: 'Vehicle created', data: createdVehicle };
	}

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get('fetch-all')
  async fetchAllVehicles(@Req() req: CustomRequest) {
  	const { user } = req;
  	const vehicles = await this.vehicleService.fetchDriverVehicles(user.driver);
  	return { message: 'Vehicles fetched', data: vehicles };
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get('fetch-images/:vehicleId')
  async fetchAllVehicleImages(@Req() req: CustomRequest, @Param('vehicleId') vehicleId: string) {
  	const { user } = req;
  	const vehicle = await this.vehicleService.fetchOneDriverVehicle(user.driver, vehicleId);
  	if (!vehicle) throw new HttpException('Vehicle does not exist', HttpStatus.NOT_FOUND);
  	const vehicleImages = await this.vehicleService.fetchVehicleImages(vehicle);
  	return { message: 'Vehicles images fetched', data: vehicleImages };
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get('fetch-one/:vehicleId')
  async fetchOneDriverVehicle(@Req() req: CustomRequest, @Param('vehicleId') vehicleId: string) {
  	const { user } = req;
  	const vehicle = await this.vehicleService.fetchOneDriverVehicle(user.driver, vehicleId);
  	if (!vehicle) throw new HttpException('Vehicle does not exist', HttpStatus.NOT_FOUND);
  	return { message: 'Vehicle fetched', data: vehicle };
  }

  @UseInterceptors(
  	FilesInterceptor('files', 4, {
  		storage: memoryStorage(),
  	}),
  )
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadVehicleImagesRequestDto })
  @Post('upload-images/:vehicleId')
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: CustomRequest,
    @Param('vehicleId') vehicleId: string,
  ) {
  	const { user } = req;
  	const vehicle = await this.vehicleService.fetchOneDriverVehicle(user.driver, vehicleId);
  	if (!vehicle) throw new HttpException('Vehicle does not exist', HttpStatus.BAD_REQUEST);
  	await this.vehicleService.uploadMultipleVehicleImage(files, vehicle);
  	return { message: 'Image uploaded' };
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Delete('delete/:vehicleId')
  async deleteOneDriverVehicle(@Req() req: CustomRequest, @Param('vehicleId') vehicleId: string) {
  	const { user } = req;
  	const deleted = await this.vehicleService.deleteOneDriverVehicle(user.driver, vehicleId);
  	if (!deleted.deletedCount) throw new HttpException('Vehicle does not exist', HttpStatus.NOT_FOUND);
  	return { message: 'Vehicle deleted' };
  }
}
