export interface IOtpService{
  generateOtp(): string;
  storeOtp(email:string,otp:string): Promise<void>
  varifyOtp(email:string, otp:string):Promise<boolean>
}