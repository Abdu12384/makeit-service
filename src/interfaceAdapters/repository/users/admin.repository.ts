import { injectable } from "tsyringe";
import { AdminModel, IAdminModel } from "../../../frameworks/database/mongodb/model/admin.model.js";
import { BaseRepository } from "../base.repository.js";



@injectable()
export class AdminRepository extends BaseRepository<IAdminModel>{
    constructor(){
       super(AdminModel)
    }
}
