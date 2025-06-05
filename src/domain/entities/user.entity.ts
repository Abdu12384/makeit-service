import { ObjectId } from "mongoose";
import { statusTypes, TRole } from "../../shared/constants";

export interface User{
   _id?:ObjectId,
   userId?: string
   name:string,
   email:string,
   phone:string,
   password:string,
   role:TRole,
   status?:statusTypes,
   profileImage?:string
   createdAt?:Date,
   lastLogin?:Date,
   onlineStatus?:'online'|'offline',
   isAdmin?:boolean
}