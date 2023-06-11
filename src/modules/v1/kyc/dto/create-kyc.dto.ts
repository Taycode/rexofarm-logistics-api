import { KYCType } from '@v1/kyc/enums/kyc.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKycDto {
  @ApiProperty({ type: String })
    type: KYCType;

  @ApiProperty({ type: String })
    url: String;

  @ApiProperty({ type: String })
    publicId: String;
}
