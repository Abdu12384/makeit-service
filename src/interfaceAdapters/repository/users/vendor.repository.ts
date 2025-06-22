import { injectable } from "tsyringe";
import { IVendorModel, VendorModel } from "../../../frameworks/database/mongodb/model/vendor.model.js";
import { BaseRepository } from "../base.repository.js";


@injectable()
export class VendorRepository extends BaseRepository<IVendorModel>{
     constructor() {
       super(VendorModel)
     }

     async updateFcmToken(userId: string, token: string): Promise<void> {
      await VendorModel.updateOne({ userId }, { $set: { fcmToken: token } });
     }

     async clearFcmToken(userId: string): Promise<void> {
      await VendorModel.updateOne({ userId }, { $unset: { fcmToken: "" } });
     }
}