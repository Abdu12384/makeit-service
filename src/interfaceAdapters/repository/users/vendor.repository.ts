import { injectable } from "tsyringe";
import { IVendorModel, VendorModel } from "../../../frameworks/database/mongodb/model/vendor.model.js";
import { BaseRepository } from "../base.repository.js";


@injectable()
export class VendorRepository extends BaseRepository<IVendorModel>{
     constructor() {
       super(VendorModel)
     }
}