import { IsString, IsNumber, IsEmail, IsObject } from "class-validator";

export class TicketDto {
  @IsString()
  clientId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  eventId!: string;

  @IsString()
  paymentMethod!: string;
}

export class PurchaseTicketDto {
  @IsNumber()
  amount!: number;

  @IsString()
  eventId!: string;

  @IsObject()
  ticket!: TicketDto;

  @IsString()
  type!: string;

  @IsNumber()
  totalTicketCount!: number;

  @IsString()
  vendorId!: string;

  @IsString()
  paymentMethod!: string;
}
