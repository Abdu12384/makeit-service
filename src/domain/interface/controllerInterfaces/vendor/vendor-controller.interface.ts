import { Request, Response } from "express";

export interface IVendorController {
	getAllVendors(req: Request, res: Response): Promise<void>;
	updateVendorStatus(req: Request, res: Response): Promise<void>;
}
