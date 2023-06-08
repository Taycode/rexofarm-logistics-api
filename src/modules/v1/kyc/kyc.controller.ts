import { KYCService } from '@v1/kyc/kyc.service';
import {
  Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import type { Express } from 'express';
import {
  ApiBearerAuth, ApiBody, ApiConsumes, ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from '@v1/auth/guards/jwt.guard';
import { ApplyForKycDto } from '@v1/kyc/dto/controller/apply-for-kyc.dto';
import { CustomRequest } from '../../../types/request.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('kyc')
@ApiTags('KYC')
export class KycController {
  constructor(private readonly kycService: KYCService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ApplyForKycDto })
  @Post('nin')
  async applyForNin(@UploadedFile() file: Express.Multer.File, @Req() req: CustomRequest) {
    const { user } = req;
    return this.kycService.applyForNin(file, user);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ApplyForKycDto })
  @Post('driver-license')
  async applyForDriverLicense(@UploadedFile() file: Express.Multer.File, @Req() req: CustomRequest) {
    const { user } = req;
    return this.kycService.applyForDriverLicense(file, user);
  }
}
