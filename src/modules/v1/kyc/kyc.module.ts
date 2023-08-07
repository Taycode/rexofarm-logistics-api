import { Module } from '@nestjs/common';
import { KYCRepository } from '@v1/kyc/kyc.repository';
import { KYCService } from '@v1/kyc/kyc.service';
import { CloudinaryModule } from '@v1/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { KYC, KYCSchema } from '@v1/kyc/schema/kyc.schema';
import { KycController } from './kyc.controller';

@Module({
  controllers: [KycController],
  providers: [KYCRepository, KYCService],
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([{ name: KYC.name, schema: KYCSchema }]),
  ],
})
export class KycModule {}
