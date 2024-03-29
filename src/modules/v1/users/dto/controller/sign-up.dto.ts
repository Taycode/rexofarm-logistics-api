import {
	IsNotEmpty,
	MinLength,
	MaxLength,
	IsString,
	IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class SignUpDto {
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
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly phone: string = '';
}
