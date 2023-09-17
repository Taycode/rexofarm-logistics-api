import {
	Controller, Post, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import {
	ApiConsumes, ApiOperation, ApiBody, ApiResponse, ApiProperty,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Express } from 'express';
import { CloudinaryService } from '@v1/cloudinary/cloudinary.service';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  	file: Express.Multer.File;
}

@Controller('cloudinary')
export class CloudinaryController {
	constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(
  	FileInterceptor('file', {
  		storage: memoryStorage(),
  	}),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file' })
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		// Handle the file buffer here
		return this.cloudinaryService.uploadImage(file);
	}
}
