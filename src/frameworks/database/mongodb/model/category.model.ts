import { model, ObjectId } from "mongoose"
import { categorySchema } from "../schema/category.schema"
import { ICategoryEntity } from "../../../../domain/entities/category.entity"
import { Document } from "mongoose"



export interface ICategoryModel extends ICategoryEntity, Document{
    _id: ObjectId   
}

export const CategoryModel = model<ICategoryModel>("Category",categorySchema)
    
