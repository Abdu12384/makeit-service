import { Expose, Exclude } from "class-transformer";
import { ObjectId } from "mongoose";

@Exclude()
export class CategoryDTO {
  @Expose() _id!: ObjectId;
  @Expose() categoryId!: string;
  @Expose() title!: string;
  @Expose() description!: string;
  @Expose() image!: string;
  @Expose() status!: string;

  constructor(partial: Partial<CategoryDTO>) {
    Object.assign(this, partial);
  }
}