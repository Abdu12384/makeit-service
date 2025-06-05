export interface ICreateBookingUseCase{
    execute(serviceId:string,date:Date,email:string,phone:string,vendorId:string,userId:string):Promise<void>
} 