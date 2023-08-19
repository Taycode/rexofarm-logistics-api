export interface VerifyOtpPayload {
	otpId: string;
	userId: string;
}

export interface CompletePasswordResetOTPPayload extends VerifyOtpPayload {
	otp: string;
}
