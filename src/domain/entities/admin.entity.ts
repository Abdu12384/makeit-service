import {  User } from "./user.entity.js";

export interface IAdminEntity extends User {
	isSuperAdmin: boolean;
}
