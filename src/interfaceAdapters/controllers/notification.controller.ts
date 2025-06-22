import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { INotificationController } from "../../domain/interface/controllerInterfaces/notification/notification-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { IGetNotificationByIdUseCase } from "../../domain/interface/useCaseInterface/notification/get-notification-id-by-usecase-interface.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IUpdateNotificationReadUseCase } from "../../domain/interface/useCaseInterface/notification/update-notificaton-read-usecase.interface.js";







@injectable()
export class NotificationController implements INotificationController{

  constructor(
    @inject("IGetNotificationByIdUseCase") private _notificationUseCase: IGetNotificationByIdUseCase,
    @inject("IUpdateNotificationReadUseCase") private _updateNotificationReadUseCase: IUpdateNotificationReadUseCase
  ){}

  async getNotifications(req: Request, res: Response): Promise<void> {
    const {userId} = (req as CustomRequest).user
    try {
      const notifications = await this._notificationUseCase.execute(userId);
      res.status(HTTP_STATUS.OK).json(notifications);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }


  async markNotificationAsRead(req: Request, res: Response): Promise<void> {
    const {userId} = (req as CustomRequest).user
    try {
      const notification = await this._updateNotificationReadUseCase.execute(userId);
      res.status(HTTP_STATUS.OK).json(notification);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

}