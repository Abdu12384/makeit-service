import { Request,Response,Router } from "express";
import { authController} from "../../di/resolver.js";



export class AuthRoute {
  public authRoute: Router;

   
   constructor(){
    this.authRoute = Router()
    this.setRoute()
   }
      private setRoute(): void{


          this.authRoute.post('/signup', (req: Request, res:Response) => 
            authController.register(req,res)
           )


          this.authRoute.post('/send-otp',(req: Request, res:Response) =>  
            authController.sendOtp(req,res)
           )


           this.authRoute.post('/login',(req:Request,res:Response) =>
            authController.login(req,res)
          )

          this.authRoute.post('/google-auth',(req:Request,res:Response) =>
            authController.authenticateWithGoogle(req,res)
           )

           this.authRoute.post('/forgot-password',(req:Request,res:Response) =>
            authController.forgotPassword(req,res)
           )

          this.authRoute.post('/reset-password',(req:Request,res:Response) =>
            authController.resetPassword(req,res)
           )

   }

}