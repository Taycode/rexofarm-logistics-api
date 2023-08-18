import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail, IsNotEmpty, IsString, MaxLength, MinLength,
} from 'class-validator';

export class InitiatePasswordResetDto {
  @ApiProperty({ type: String })
  	email: string;
}

export class ValidatePasswordResetDto {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	readonly verificationToken: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
	readonly otp: string;
}

export class CompletePasswordResetDto {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	readonly verificationToken: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
	readonly password: string;
}
