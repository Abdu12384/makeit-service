import { Request, Response } from "express";

export interface IWorkSampleController {
    createWorkSample(req: Request, res: Response): Promise<void>
    updateWorkSample(req: Request, res: Response): Promise<void>
    getAllWorkSamplesByVendorId(req: Request, res: Response): Promise<void>
}
