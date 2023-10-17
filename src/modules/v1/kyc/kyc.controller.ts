import { KYCService } from '@v1/kyc/kyc.service';
import {
	Controller, Get, Post, Req, UploadedFiles, UseGuards, UseInterceptors
} from "@nestjs/common";
import type { Express } from 'express';
import {
	ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags
} from "@nestjs/swagger";
import { JWTAuthGuard } from '@v1/auth/guards/jwt.guard';
import { ApplyForKycDto } from '@v1/kyc/dto/controller/apply-for-kyc.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CustomRequest } from '../../../types/request.type';
import { FetchKycStatusEntity } from "@v1/kyc/entities/fetch-kyc-status.entity";

// ToDo: User onboarding status to know when KYC has been completed

@Controller('kyc')
@ApiTags('KYC')
export class KycController {
	constructor(private readonly kycService: KYCService) {}

  @UseInterceptors(
  	FilesInterceptor('files', 2, {
  		storage: memoryStorage(),
  	}),
  )
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ApplyForKycDto })
  @Post('nin')
	async applyForNin(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: CustomRequest) {
		const { user } = req;
		return this.kycService.applyForNin(files, user);
	}

  @UseInterceptors(
  	FilesInterceptor('file', 2, {
  		storage: memoryStorage(),
  	}),
  )
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ApplyForKycDto })
  @Post('driver-license')
  async applyForDriverLicense(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: CustomRequest) {
  	const { user } = req;
  	return this.kycService.applyForDriverLicense(files, user);
  }

	@ApiBearerAuth()
	@UseGuards(JWTAuthGuard)
	@ApiOkResponse({
		description: 'KYC Status successfully fetched',
		type: FetchKycStatusEntity,
	})
	@Get('fetch')
  async fetchKycStatus(@Req() req: CustomRequest) {
  	const { user } = req;
  	return this.kycService.fetchKycStatus(user);
  }
}
