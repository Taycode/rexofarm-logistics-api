import { KYCType } from '@v1/kyc/enums/kyc.enum';

class KycFileDto {
	url: String;

	publicId: String;
}

export class CreateKycDto {
	type: KYCType;

	files: KycFileDto[];
}
