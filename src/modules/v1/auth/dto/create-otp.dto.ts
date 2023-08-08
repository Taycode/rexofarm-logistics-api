import {
  IsNotEmpty, MinLength, MaxLength, IsString, IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateOTPDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MinLength(3)
    @MaxLength(128)
  readonly email: string = '';

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly otp: string = '';
}

