import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class UploadVehicleImagesRequestDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  	files: Array<Express.Multer.File>;
}
