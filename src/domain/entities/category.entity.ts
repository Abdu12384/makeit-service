import { ObjectId } from "mongoose";

export interface ICategoryEntity{
    _id?:ObjectId;
    categoryId:string;
    title:string;
    description:string;
    status?:string;
    image?:string
}