import { ApiProperty } from "@nestjs/swagger";
import { KYCStatus } from "@v1/kyc/enums/kyc.enum";

export class FetchKycStatusEntity {
	@ApiProperty({ enum: KYCStatus, nullable: true })
		nin: KYCStatus | null

	@ApiProperty({ enum: KYCStatus, nullable: true })
		driverLicense: KYCStatus | null
}
