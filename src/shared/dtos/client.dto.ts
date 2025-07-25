import { Expose, Exclude } from "class-transformer";

@Exclude()
export class UserDto {
  @Expose() userId!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() role!: string;
  @Expose() status!: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
