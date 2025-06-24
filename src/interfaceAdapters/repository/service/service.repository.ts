import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { IServiceRepository } from "../../../domain/interface/repositoryInterfaces/service/service-repository.interface";
import { IServiceModel, serviceModel } from "../../../frameworks/database/mongodb/model/service.model";
import { FilterType, PopulatedItem, SortType } from "../../../shared/constants";



@injectable()
export class ServiceRepository extends BaseRepository<IServiceModel> implements IServiceRepository{
   constructor(){
     super(serviceModel)
   }


   async findAllWithPopulate(filter: FilterType, skip: number, limit: number, sort: SortType): Promise<{ items: PopulatedItem[], total: number }> {
    const pipeline: any[] = [
      { $match: filter },
  
      {
        $lookup: {
          from: "categories",               
          localField: "categoryId",         
          foreignField: "categoryId",       
          as: "category"
        }
      },
      {
        $lookup: {
          from: "vendors",               
          localField: "vendorId",         
          foreignField: "userId",       
          as: "vendor"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      { $match: { "category.status": "active" } },
  
      {
        $project: {
          serviceId: 1,
          serviceTitle: 1,
          additionalHourFee: 1,
          serviceDescription: 1,
          servicePrice: 1,
          serviceDuration: 1,
          yearsOfExperience: 1,
          vendorId: 1,
          categoryId: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          termsAndCondition: 1,
          cancellationPolicy: 1,
          category: {
            title: 1,
            image: 1,
            status: 1,
            categoryId: 1
          },
          vendor: {
            name: 1,
            email: 1,
            profileImage: 1
          }

        }
      },
  
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    ];
  
    const countPipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "categoryId",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },
      { $match: { "category.status": "active" } },
      { $count: "total" }
    ];

    const [items, countResult] = await Promise.all([
      this.model.aggregate(pipeline),
      this.model.aggregate(countPipeline)
    ]);
  
    return {
      items,
      total: countResult[0]?.total || 0
    };
  }
  
  }