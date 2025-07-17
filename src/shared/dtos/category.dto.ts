import { Expose, Exclude } from "class-transformer";

@Exclude()
export class CategoryDTO {
  @Expose() categoryId!: string;
  @Expose() title!: string;
  @Expose() description!: string;
  @Expose() image!: string;
  @Expose() status!: string;

  constructor(partial: Partial<CategoryDTO>) {
    Object.assign(this, partial);
  }
}