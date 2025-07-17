export interface IEventEntity {
    eventId?: string ;
    title: string;
    description: string;
    location: {
        type: string,
        coordinates: [number, number];
    },
    hostedBy: string,
    startTime: string;
    endTime: string;
    posterImage: string[];
    pricePerTicket: number;
    maxTicketsPerUser: number;
    totalTicket: number;
    date: Date[];
    createdAt: Date;
    attendees: string[]
    ticketPurchased?: number
    address?: string
    venueName?: string
    category: string
    status: "upcoming" | "completed" | "cancelled" | "ongoing"
    attendeesCount: number
    checkedInCount?: number
    isActive:boolean
}