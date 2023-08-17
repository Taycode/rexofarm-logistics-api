import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import CreateUserDto from '@v1/auth/dto/create-user.dto';

export default class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
  	type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
	readonly verified: boolean = false;
}
