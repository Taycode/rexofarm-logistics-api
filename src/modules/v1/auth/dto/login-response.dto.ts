import { ApiProperty } from '@nestjs/swagger';
import { KycUploadStatusEnum } from '@v1/users/enums/kyc-upload-status.enum';

export default class LoginResponseDto {
    @ApiProperty({
      type: String,
    })
  readonly token: string = '';

    @ApiProperty({ type: KycUploadStatusEnum })
    readonly kycStatus: KycUploadStatusEnum = KycUploadStatusEnum.NONE;
}
