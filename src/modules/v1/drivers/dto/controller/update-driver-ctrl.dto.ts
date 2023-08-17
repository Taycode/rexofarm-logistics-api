import { ApiProperty } from '@nestjs/swagger';


export class UpdateDriverCtrlDto {
  @ApiProperty({ type: String })
  	state: string;

  @ApiProperty({ type: String })
  	city: string;

  @ApiProperty({ type: String })
  	address: string;
}

export class UpdateDriverNextOfKinCtrlDto {
  @ApiProperty({ type: String, required: true })
  	fullName: string;

  @ApiProperty({ type: String, required: true })
  	gender: string;

  @ApiProperty({ type: String, required: true })
  	relationship: string;

  @ApiProperty({ type: String, required: true })
  	phone: string;

  @ApiProperty({ type: String, required: true })
  	state: string;

  @ApiProperty({ type: String, required: true })
  	city: string;

  @ApiProperty({ type: String, required: true })
  	address: string;
}
