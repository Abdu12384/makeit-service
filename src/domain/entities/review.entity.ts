export interface IReviewEntity {
    _id?: string;
    comment: string;
    rating: number;
    reviewerId: string;
    targetType: "service" | "event";
    targetId: string;
}