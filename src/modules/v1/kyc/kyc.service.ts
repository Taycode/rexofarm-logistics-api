import { KYCRepository } from '@v1/kyc/kyc.repository';
import { CreateKycDto } from '@v1/kyc/dto/create-kyc.dto';
import { User } from '@v1/users/schemas/users.schema';
import { KYCStatus, KYCType } from '@v1/kyc/enums/kyc.enum';
import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '@v1/cloudinary/cloudinary.service';
import type { Express } from 'express';

@Injectable()
export class KYCService {
  constructor(
    private readonly kycRepository: KYCRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async applyForKyc(file: Express.Multer.File, type: KYCType, user: User) {
    const existingKyc = await this.findUserPendingKyc(user, type);
    if (existingKyc) throw new Error(`A pending kyc already exists: ${type}`);
    const cloudinaryUpload = await this.cloudinaryService.uploadImage(file);
    return this.kycRepository.createKyc({
      type,
      url: cloudinaryUpload.secure_url,
      publicId: cloudinaryUpload.public_id,
    }, user);
  }

  public async findUserPendingKyc(user: User, type: CreateKycDto['type']) {
    return this.kycRepository.findOne({ user, type, status: KYCStatus.PENDING });
  }

  public async applyForNin(file: Express.Multer.File, user: User) {
    return this.applyForKyc(file, KYCType.NIN, user);
  }

  public async applyForDriverLicense(file: Express.Multer.File, user: User) {
    return this.applyForKyc(file, KYCType.DRIVER_LICENSE, user);
  }
}
