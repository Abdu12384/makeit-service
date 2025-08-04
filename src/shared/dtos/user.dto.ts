import { statusTypes, TRole } from "../constants";

export interface IAdminDTO {
   userId?:string;
   name?:string;
   email:string;
   password:string;
   role:TRole
}


export interface IClientDTO {
	userId?: string;
	name: string;
	email: string;
	phone?: string;
	password?: string;
   googleVarified?:boolean;
	googleId?: string;
   profileImage?:string
	role: TRole;
}

export interface IVendorDTO {
   userID?: string,
   name: string;
   email: string;
   phone?: string;
   password: string
   vendorStatus?: statusTypes
   idProof: string;
   role:TRole
}


export type IUserDTO = IAdminDTO | IClientDTO |  IVendorDTO ;

export interface ILoginUserDTO{
   email: string;
   password?: string;
   role: TRole
}