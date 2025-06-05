import { model, ObjectId } from "mongoose"
import { categorySchema } from "../schema/category.schema.js"
import { ICategoryEntity } from "../../../../domain/entities/category.entity.js"
import { Document } from "mongoose"



export interface ICategoryModel extends ICategoryEntity, Document{
    _id: ObjectId   
}

export const CategoryModel = model<ICategoryModel>("Category",categorySchema)
    
