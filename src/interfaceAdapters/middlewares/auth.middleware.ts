import { JwtPayload } from "jsonwebtoken";
import { JWTService } from "../../useCases/services/jwt-service.js";
import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { redisClient } from "../../frameworks/cashe/redis.client.js";






const tokenServiec = new JWTService()

export interface CustomJwtPayload extends JwtPayload{
   userId: string;
   email: string;
   role: string;
   access_token: string;
   refresh_token: string
}


export interface CustomRequest extends Request{
    user: CustomJwtPayload
}





// ========================================================================
//  VerifyAuth Middleware
// ========================================================================

export const verifyAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
     try {
        const token = extractToken(req)
        console.log('verify first ',token)
        if(!token){
          res.status(HTTP_STATUS.UNAUTHORIZED).json({
             success: false,
             message: ERROR_MESSAGES.TOKEN_BLACKLISTED
          })
          return
        }

       if(await isBlacklisted(token.access_token)){
         res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: ERROR_MESSAGES.TOKEN_BLACKLISTED,
         })
         return
       }
       const user = tokenServiec.verifyAccessToken(
         token.access_token
       ) as CustomJwtPayload
       if(!user || !user.userId){
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
           message: ERROR_MESSAGES.TOKEN_EXPIRED
        })
        return
       }
       (req as CustomRequest).user = {
        ...user,
        access_token: token.access_token,
        refresh_token: token.refresh_token
       }
        next()
     } catch (error: any) {
       if(error.name === "TokenExpiredError"){
         console.log(error.name)
         res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.TOKEN_EXPIRED
         })
         return
       } 

       console.log("Invalid token response sent")
       res.status(HTTP_STATUS.UNAUTHORIZED).json({
         message: ERROR_MESSAGES.INVALID_TOKEN
       })
       return
     }
}







// ========================================================================
//  Extract Token Helper Fn
// ========================================================================
 const extractToken = (req: Request): {access_token:string; refresh_token:string} | null =>{
     const userType = req.path.split("/")[1];
      console.log('user type',userType)
     if(!userType) return null

     return{
       access_token: req.cookies?.[`${userType}_access_token`] ?? null,
       refresh_token: req.cookies?.[`${userType}_refresh_token`] ?? null
     }
 }













// ========================================================================
//  Blacklist checker Fn
// ========================================================================
const isBlacklisted = async (token: string): Promise<boolean> =>{
   try {
      console.log("Blacklist for tokne", token)
      const result = await redisClient.get(token)
      return result !== null
   } catch (error) {
     console.error("Redis error:",error)
     return false
   }
}









// ========================================================================
// Authorize Role Middlewere
// ========================================================================
export const authorizeRole = (allowedRoles: string[]) => {
   return (req: Request, res: Response, next: NextFunction) => {
       const user = (req as CustomRequest).user;
       if(!user || !allowedRoles.includes(user.role)){
         res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: ERROR_MESSAGES.NOT_ALLOWED,
            userRole: user ? user.role : "none"
         })
         return
       }
       next()
   }
}







// ========================================================================
// Decode Token MiddleWare
// ========================================================================
export const decodeToken = async (req: Request, res: Response, next:NextFunction) =>{
    try {
        const token = extractToken(req)

        if(!token){
           console.log("no tokeen")
           res.status(HTTP_STATUS.UNAUTHORIZED).json({
             message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
           })
           return
        }

        if(await isBlacklisted(token.access_token)){
           console.log("token is black listed")
           res.status(HTTP_STATUS.FORBIDDEN).json({
            message: ERROR_MESSAGES.TOKEN_BLACKLISTED,
           })
           return
        }

        const user = tokenServiec.decodeAccessToken(token?.access_token);
        console.log(`Decoded`,user);
         (req as CustomRequest).user = {
            userId: user?.userId,
            email: user?.email,
            role: user?.role,
            access_token: token.access_token,
            refresh_token: token.refresh_token
         }
         next()
    } catch (error) {}
}