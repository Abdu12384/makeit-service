import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDTO{
  @Expose()
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image!: string;
}
