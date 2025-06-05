import { inject, injectable } from "tsyringe";
import { IGetEventsByVendorIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-by-vendorId-usecase.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";







@injectable()
export class GetEventsByVendorIdUseCase implements IGetEventsByVendorIdUseCase{
    constructor(
        @inject("IEventRepository") private _eventRepository: IEventRepository
    ){}

    async execute(userId:string,pageNumber:number,pageSize:number):Promise<any>{


        const validPageNumber = Math.max(1, pageNumber || 1);
        const validPageSize = Math.max(1, pageSize || 10);
        const skip = (validPageNumber - 1) * validPageSize;

        const limit = validPageSize;

        const sort = { createdAt: -1 };

         

        const {items, total} = await this._eventRepository.findAll({hostedBy:userId},skip,limit,sort)
        const response = {
            events:items,
            total:Math.ceil(total/validPageSize)
        }
        return response
    }
}