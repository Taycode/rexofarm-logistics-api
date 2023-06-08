import { KYCService } from '@v1/kyc/kyc.service';
import {
  Controller, Post, Req, UploadedFile,
} from '@nestjs/common';
import type { Express } from 'express';
import { CustomRequest } from '../../../types/request.type';

@Controller()
export class KycController {
  constructor(private readonly kycService: KYCService) {}

  @Post('nin')
  async applyForNin(@UploadedFile() file: Express.Multer.File, @Req() req: CustomRequest) {
    const { user } = req;
    return this.kycService.applyForNin(file, user);
  }

  @Post('driver-license')
  async applyForDriverLicense(@UploadedFile() file: Express.Multer.File, @Req() req: CustomRequest) {
    const { user } = req;
    return this.kycService.applyForDriverLicense(file, user);
  }
}
