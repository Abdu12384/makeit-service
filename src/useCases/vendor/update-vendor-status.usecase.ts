import { inject, injectable } from "tsyringe";
import { IUpdateVendorStatusUseCase } from "../../domain/interface/useCaseInterface/vendor/update-vendor-status-usecase.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { ISendEmailUseCase } from "../../domain/interface/useCaseInterface/common/send-email-usecase.interface";
import { statusTypes, VENDOR_APPLICATION_MAIL_CONTENT } from "../../shared/constants";


@injectable()
export class UpdateVendorStatusUseCase implements IUpdateVendorStatusUseCase{
     constructor(
     
      @inject("IVendorRepository")
      private _vendorRepository : IVendorRepository,
     
      @inject("ISendEmailUseCase")
      private _sendEmailUseCase : ISendEmailUseCase
     ){}
     
     async execute(id: string, status: statusTypes, message?: string): Promise<void> {
         const vendor = await this._vendorRepository.findOne({userId: id})
          if(status === "rejected"){
             await this._sendEmailUseCase.execute(
              vendor?.email as string,
              "MakeIt - Application rejected",
               VENDOR_APPLICATION_MAIL_CONTENT(message as string,vendor?.name as string,status)
             )
           await this._vendorRepository.update({userId: id}, {vendorStatus: "rejected"})
          }else{
            await this._vendorRepository.update({userId: id}, {vendorStatus: "approved",status:"active"})
            await this._sendEmailUseCase.execute(
              vendor?.email as string,
              "MakeIt - Application approved",
              VENDOR_APPLICATION_MAIL_CONTENT("your requst approved by admin",vendor?.name as string,"approved")
            )
          }
     }

}