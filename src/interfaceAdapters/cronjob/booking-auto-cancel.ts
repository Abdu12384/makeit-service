import { inject , container } from "tsyringe";
import cron from 'node-cron'
import { IBookingAutoCancelUseCase } from "../../domain/interface/useCaseInterface/cronjob/booking-auto-cancel-usecase.interface";
import { IBookingAutoCancelController } from "../../domain/interface/controllerInterfaces/cron/booking-auto-cancel";







export class BookingAutoCancelController implements IBookingAutoCancelController {
    
  constructor(
    @inject("IBookingAutoCancelUseCase")
    private _bookingAutoCancelUseCase: IBookingAutoCancelUseCase
  ){}
  async execute(): Promise<void> {
    await this._bookingAutoCancelUseCase.execute();
  }

  public static schedule(): void {
    cron.schedule("0 * * * *", async () => {
      const controller = container.resolve(BookingAutoCancelController);
      await controller.execute();
    });
  }

}