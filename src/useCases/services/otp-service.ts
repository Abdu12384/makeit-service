import { injectable,inject } from "tsyringe";
import { IOtpService } from "../../domain/interface/servicesInterface/otp-service.interface";
import { IOtpRepositroy } from "../../domain/interface/repositoryInterfaces/common-services/otp-service.repository";


@injectable()
export class OtpService implements IOtpService{
      constructor(
        @inject("IOtpRepositroy")
        private otpRepository: IOtpRepositroy
        
        
      
      ){}
   
    // =================== Genarate OTP =====================//  
      generateOtp(): string {
      return Math.floor(100000 + Math.random()* 900000).toString() 
      }

  // ===================== Save OTP ===========================//
     async storeOtp(email: string, otp: string): Promise<void> {
       console.log('storing otp')
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + 2)

      await this.otpRepository.deleteOtp(email)

      await this.otpRepository.saveOtp({
        email,
        otp,
        expiresAt
      })
     }

     
 //======================= Varify OTP =========================//
  async varifyOtp(email: string, otp: string): Promise<boolean> {
    const savedOtp = await this.otpRepository.findOtpByEmail(email)

    if(!savedOtp){
      return false
    }

    const isOtpValid = savedOtp.otp === otp;
    const isExpired = new Date() > new Date(savedOtp.expiresAt)

    return isOtpValid && !isExpired
  }

}