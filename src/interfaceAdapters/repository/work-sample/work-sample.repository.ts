import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { IWorkSampleRepository } from "../../../domain/interface/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { IWorkSampleModel, workSampleModel } from "../../../frameworks/database/mongodb/model/worksample.model";








@injectable()
export class WorkSampleRepository extends BaseRepository<IWorkSampleModel> implements IWorkSampleRepository {
    
   constructor(){
    super(workSampleModel)
   }
}
