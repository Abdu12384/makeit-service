import { Request, Response } from "express";

export interface IUserController {
	getAllUsers(req: Request, res: Response): Promise<void>;
	updateUserStatus(req: Request, res: Response): Promise<void>;
	refreshSession(req: Request, res: Response): Promise<void>;
	updateUserDetails(req: Request, res: Response): Promise<void>;
	changePassword(req: Request, res: Response): Promise<void>;
	saveFCMToken(req: Request, res: Response): Promise<void>;
}
