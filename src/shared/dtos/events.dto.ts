import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class EventDTO {
  @Expose() _id!: string;
  @Expose() eventId!: string;
  @Expose() title!: string;
  @Expose() description!: string;
  @Expose() category!: string;
  @Expose() status!: string;
  @Expose() venueName!: string;
  @Expose() pricePerTicket!: number;
  @Expose() totalTicket!: number;
  @Expose() maxTicketsPerUser!: number;
  @Expose() address!: string;
  @Expose() hostedBy!: string;
  
  @Expose()
  @Type(() => String)
  date!: string[];

  @Expose()
  @Type(() => String)
  posterImage!: string[];

  @Expose()
  @Type(() => String)
  attendees!: string[];

  @Expose() startTime!: string;
  @Expose() endTime!: string;
  @Expose() createdAt!: string;
  @Expose() isActive!: boolean;

  @Expose() attendeesCount!: number;
  @Expose() checkedInCount!: number;
  @Expose() ticketPurchased!: number;

  @Expose()
  @Type(() => LocationDTO)
  location!: LocationDTO;

  constructor(partial: Partial<EventDTO>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class LocationDTO {
  @Expose() type!: string;
  @Expose()
  @Type(() => Number)
  coordinates!: number[];
}
