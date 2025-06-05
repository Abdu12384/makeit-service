export interface IVerifyOtpEmailUseCase{
  execute(email:string, otp:string): Promise<boolean>
}