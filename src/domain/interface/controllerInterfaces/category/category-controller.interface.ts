
import { Request, Response } from "express";

export interface ICategoryController {
   createCategory(req:Request,res:Response):Promise<void>
   getAllCategories(req:Request,res:Response):Promise<void>
   updateCategoryStatus(req:Request,res:Response):Promise<void>
   editCategory(req:Request,res:Response):Promise<void>
} 