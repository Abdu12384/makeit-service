export interface IGetWalletByIdUseCase{
    execute(userId:string,pageNumber:number,pageSize:number):Promise<any> 
}