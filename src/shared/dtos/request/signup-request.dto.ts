import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty, IsString } from 'class-validator';
import { FormDataDto } from './formdata.dto';

export class SignupDto {
  @ValidateNested()
  @Type(() => FormDataDto)
  formdata!: FormDataDto;

  @IsNotEmpty()
  @IsString()
  otpString!: string;
}
