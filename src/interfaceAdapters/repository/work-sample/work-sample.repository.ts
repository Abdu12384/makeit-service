import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import { IWorkSampleRepository } from "../../../domain/interface/repositoryInterfaces/work-sample/work-sample-repository.interface.js";
import { IWorkSampleModel, workSampleModel } from "../../../frameworks/database/mongodb/model/worksample.model.js";








@injectable()
export class WorkSampleRepository extends BaseRepository<IWorkSampleModel> implements IWorkSampleRepository {
    
   constructor(){
    super(workSampleModel)
   }
}
