export interface ICreateEventUseCase{
    execute(data:any,userId:string):Promise<any>
}