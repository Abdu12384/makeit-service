import { model, ObjectId } from "mongoose";
import { IWorkSampleEntity } from "../../../../domain/entities/worksample.entity";
import { workSampleSchema } from "../schema/worksample.schema";




export interface IWorkSampleModel extends IWorkSampleEntity{
    _id: ObjectId
} 



export const workSampleModel = model<IWorkSampleModel>('workSample', workSampleSchema);