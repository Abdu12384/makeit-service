import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, ValidateIf } from 'class-validator';

export class FormDataDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @MinLength(6)
  confirmPassword!: string;

  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  phone!: string;

  @ValidateIf((o) => o.role === 'vendor')
  @IsNotEmpty({ message: 'ID Proof is required for vendors' })
  @IsString()
  idProof?: string;
  
  
  @IsNotEmpty()
  @IsString()
  role!: string;
}
