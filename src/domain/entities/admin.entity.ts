import {  User } from "./user.entity";

export interface IAdminEntity extends User {
	isSuperAdmin: boolean;
}
