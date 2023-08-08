import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class VerifyUserDto {
  @ApiProperty({ type: String })
  readonly email: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly otp: string = '';
}
