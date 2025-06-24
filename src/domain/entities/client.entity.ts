import { User } from "./user.entity";
export interface IClientEntity extends User{
   userId?:string,
   googleVarified?:boolean,
   fcmToken?:string
}