// dto/Booking.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsDateString } from "class-validator";

export class BookingDto {
  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  vendorId!: string;
}
