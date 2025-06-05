import { injectable } from "tsyringe";
import { IBaseRepository } from "../base-repository.interface.js";
import { IVendorEntity } from "../../../entities/vendor.entity";



export interface IVendorRepository extends IBaseRepository<IVendorEntity>{}