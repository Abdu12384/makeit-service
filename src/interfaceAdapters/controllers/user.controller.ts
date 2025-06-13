import { Request, Response } from "express";
import { IUserController } from "../../domain/interface/controllerInterfaces/users/user-controller.intreface.js";
import { inject, injectable } from "tsyringe";
import { IGetAllUsersUseCase } from "../../domain/interface/useCaseInterface/users/get-all-users-usecase.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES, TRole } from "../../shared/constants.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IUpdateUserStatusUseCase } from "../../domain/interface/useCaseInterface/users/update-user-status-usecase.interface.js";
import { IGetAllVendorUseCase } from "../../domain/interface/useCaseInterface/vendor/get-all-vendor-usecase.interface.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IGetUserDetailsUseCase } from "../../domain/interface/useCaseInterface/users/get-user-details-usecase.interface.js";
import { IUpdateUserDetailsUseCase } from "../../domain/interface/useCaseInterface/users/update-user-details-usecase.interface.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { IChangePasswordUseCase } from "../../domain/interface/useCaseInterface/users/change-password-usecase.interface.js";


@injectable()
export class UserController implements IUserController{
   constructor(
      @inject("IGetAllUsersUseCase")
      private _getAllUserUserCase: IGetAllUsersUseCase,

      @inject("IUpdateUserStatusUseCase")
      private _updateUserStatusUseCase : IUpdateUserStatusUseCase,

      @inject("IGetAllVendorUseCase")
      private _getAllVendorUseCase : IGetAllVendorUseCase,

      @inject("IGetUserDetailsUseCase")
      private _getUserDetailsUseCase: IGetUserDetailsUseCase,

      @inject("IUpdateUserDetailsUseCase")
      private _updateUserDetailsUseCase : IUpdateUserDetailsUseCase,

      @inject("IChangePasswordUseCase")
      private _changePasswordUseCase : IChangePasswordUseCase
   ){}




// ══════════════════════════════════════════════════════════
//  Get All Users (Role Based)
// ══════════════════════════════════════════════════════════

async getAllUsers(req: Request, res: Response): Promise<void> {
   try {
        const { page = 1, limit = 10, search="", userType} = req.query
        const pageNumber = Number(page)
        const pageSize = Number(limit)
        const userTypeString =
                   typeof userType === "string" ? userType : "client";
                const searchTermString = typeof search === "string" ? search : "";

                if(userType === "vendor"){
                  const {users, total} = await this._getAllUserUserCase.execute(
                      "vendor",
                      pageNumber,
                      pageSize,
                      searchTermString
                  )
                  res.status(HTTP_STATUS.OK).json({
                      success:true,
                      users,
                      totalPages: total,
                      currentPages: pageNumber
                  })
                  return
                }

                const {users , total} = await this._getAllUserUserCase.execute(
                  userTypeString,
                  pageNumber,
                  pageSize,
                  searchTermString
                )

                res.status(HTTP_STATUS.OK).json({
                  success: true,
                  users,
                  totalPages: total,
                  currentPages: pageNumber
                })
            } catch (error) {
            handleErrorResponse(res, error)
           }
}





// ══════════════════════════════════════════════════════════
//  Update User Status
// ══════════════════════════════════════════════════════════

 async updateUserStatus(req: Request, res: Response): Promise<void> {
     try {

        const {userType, userId} = req.query as{
           userType: string,
           userId: string
        }

        await this._updateUserStatusUseCase.execute(userType, userId)

        res.status(HTTP_STATUS.OK).json({
          success: true,
          message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
        })
     } catch (error) {
       handleErrorResponse(res, error)
     }
 }



// ══════════════════════════════════════════════════════════
//   Refresh Session
// ══════════════════════════════════════════════════════════
async refreshSession(req: Request, res: Response): Promise<void> {
   try {
      const { userId, role } = (req as CustomRequest).user;
      if (!userId || !role) {
         res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: ERROR_MESSAGES.INVALID_TOKEN,
         });
         return;
      }
      const user = await this._getUserDetailsUseCase.execute(
         userId,
         role as TRole
      );
      res.status(HTTP_STATUS.OK).json({
         success: true,
         user: user,
      });
   } catch (error) {
      handleErrorResponse(res, error);
   }
}






// ══════════════════════════════════════════════════════════
//   Update User Details
// ══════════════════════════════════════════════════════════

  async updateUserDetails(req: Request, res: Response): Promise<void> {
     try {
       const data = req.body
       console.log(data)
       const {userId, role} = (req as CustomRequest).user;
       const updatedUser = await this._updateUserDetailsUseCase.execute(
         userId,
         role,
         data
       )
   if(!updatedUser){
       throw new CustomError(
           ERROR_MESSAGES.USER_NOT_FOUND,
           HTTP_STATUS.NOT_FOUND
       )
   }

   const {password, ...userWithoutPassword} = updatedUser
   res.status(HTTP_STATUS.OK).json({
       success:true,
       message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
       user: userWithoutPassword,
   })
     } catch (error) {
       handleErrorResponse(res,error)      
     }
  }






// ══════════════════════════════════════════════════════════
//   Change Password
// ══════════════════════════════════════════════════════════

async changePassword(req: Request, res: Response): Promise<void> {
     try {
        const {currentPassword, newPassword} = req.body

       const {userId, role} = (req as CustomRequest).user;
       const updatedUser = await this._changePasswordUseCase.execute(
         userId,
         currentPassword,
         newPassword,
         role
       )
   res.status(HTTP_STATUS.OK).json({
       success:true,
       message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
   })
     } catch (error) {
       handleErrorResponse(res,error)      
     }
   }



}