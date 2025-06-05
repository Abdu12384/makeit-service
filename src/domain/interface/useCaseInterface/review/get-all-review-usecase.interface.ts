export interface IGetAllReviewUseCase {
    execute(targetId: string, targetType: string,pageNumber:number,pageSize:number): Promise<any>
}