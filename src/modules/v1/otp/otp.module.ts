import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { OtpService } from "@v1/otp/otp.service";
import { OTPRepository } from "@v1/otp/otp.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { OTP, OTPSchema } from "@v1/otp/schemas/otp.schema";

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: OTP.name,
			schema: OTPSchema,
		}]),
		JwtModule
	],
	providers: [OtpService, OTPRepository],
	exports: [OtpService],
})
export class OTPModule {}
