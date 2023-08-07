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

  private uploadMultipleImages(files: Array<Express.Multer.File>) {
    return Promise.all(files.map((file) => this.cloudinaryService.uploadImage(file)));
  }

  private async applyForKyc(files: Array<Express.Multer.File>, type: KYCType, user: User) {
    const existingKyc = await this.findUserPendingKyc(user, type);
    if (existingKyc) throw new Error(`A pending kyc already exists: ${type}`);
    const cloudinaryUploads = await this.uploadMultipleImages(files);
    const kycFiles: CreateKycDto['files'] = cloudinaryUploads.map((eachFile) => {
      return {
        url: eachFile.secure_url,
        publicId: eachFile.public_id,
      };
    });

    return this.kycRepository.createKyc({
      type,
      files: kycFiles,
    }, user);
  }

  public async findUserPendingKyc(user: User, type: CreateKycDto['type']) {
    return this.kycRepository.findOne({ user, type, status: KYCStatus.PENDING });
  }

  public async applyForNin(files: Array<Express.Multer.File>, user: User) {
    return this.applyForKyc(files, KYCType.NIN, user);
  }

  public async applyForDriverLicense(files: Array<Express.Multer.File>, user: User) {
    return this.applyForKyc(files, KYCType.DRIVER_LICENSE, user);
  }
}
