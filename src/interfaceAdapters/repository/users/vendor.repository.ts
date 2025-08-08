import { injectable } from "tsyringe";
import { IVendorModel, VendorModel } from "../../../frameworks/database/mongodb/model/vendor.model";
import { BaseRepository } from "../base.repository";
import { IVendorRepository } from "../../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";


@injectable()
export class VendorRepository extends BaseRepository <IVendorModel> implements IVendorRepository{
     constructor() {
       super(VendorModel)
     }

     async updateFcmToken(userId: string, token: string): Promise<void> {
      await VendorModel.updateOne({ userId }, { $set: { fcmToken: token } });
     }

     async clearFcmToken(userId: string): Promise<void> {
      await VendorModel.updateOne({ userId }, { $unset: { fcmToken: "" } });
     }

     async vendorSave(data:IVendorModel):Promise<void>{
        await data.save()  
     }

     async VendorfindOne(userId:string ):Promise<IVendorModel | null> {
      return this.model.findOne({userId})
     }

     async BookingDates(userId:string ):Promise<IVendorModel | null> {
      return this.model.findOne({userId},{bookedDates:1})
     }
}