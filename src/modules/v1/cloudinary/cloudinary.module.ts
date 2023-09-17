import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from '@v1/cloudinary/cloudinary.controller';

@Module({
	controllers: [CloudinaryController],
	providers: [CloudinaryProvider, CloudinaryService],
	exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
