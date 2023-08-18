import { ApiProperty } from '@nestjs/swagger';

export default class JwtTokensDto {
  @ApiProperty({
  	type: String,
  })
	readonly token: string = '';
	//
	// @ApiProperty({
	//   type: String,
	// })
	// readonly refreshToken: string = '';
}
