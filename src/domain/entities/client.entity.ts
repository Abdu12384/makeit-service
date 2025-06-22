import { User } from "./user.entity.js";
export interface IClientEntity extends User{
   userId?:string,
   googleVarified?:boolean,
   fcmToken?:string
}