import { inject, injectable } from "tsyringe";
import { IGetAllTicketsByIdUseCase } from "../../domain/interface/useCaseInterface/ticket/get-all-tickets-by-id-usecase.interface";
import { ITicketEntity } from "../../domain/entities/ticket.entity";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";

@injectable()
export class GetAllTicketsByIdUseCase implements IGetAllTicketsByIdUseCase {
  constructor(
    @inject("ITicketRepository")
    private _ticketRepository: ITicketRepository
  ) {}

  async execute(
    userId: string,
    pageNumber: number,
    pageSize: number,
    status: string
  ): Promise<{ tickets: ITicketEntity[]; total: number }> {
    const validPageNumber = Math.max(1, pageNumber || 1);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;
    const sort = { createdAt: -1 as -1 };

    const filter: Record<string, unknown> = {
      clientId: userId,
    };

    if (status) {
      if (status === "unused") {
        filter.ticketStatus = { $in: ["unused", "partially_refunded"] };
      } else {
        filter.ticketStatus = status;
      }
    }

    const { items, total } = await this._ticketRepository.getAllTicketsById(
      filter,
      skip,
      limit,
      sort
    );

    const response = {
      tickets: items,
      total: Math.ceil(total / validPageSize),
    };
    return response;
  }
}
