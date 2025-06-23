import { Request, Response } from "express";

export interface IServiceController {
	addService(req: Request, res: Response): Promise<void>;
	editService(req: Request, res: Response): Promise<void>;
	updateServiceStatus(req: Request, res: Response): Promise<void>;
	getAllServices(req: Request, res: Response): Promise<void>;
	getServiceById(req: Request, res: Response): Promise<void>;
	blockService(req: Request, res: Response): Promise<void>;
}
