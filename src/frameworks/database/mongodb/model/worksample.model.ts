import { model, ObjectId } from "mongoose";
import { IWorkSampleEntity } from "../../../../domain/entities/worksample.entity.js";
import { workSampleSchema } from "../schema/worksample.schema.js";




export interface IWorkSampleModel extends IWorkSampleEntity{
    _id: ObjectId
} 



export const workSampleModel = model<IWorkSampleModel>('workSample', workSampleSchema);