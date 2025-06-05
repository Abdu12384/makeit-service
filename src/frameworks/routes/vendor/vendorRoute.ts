import { Request,RequestHandler,Response,Router } from "express";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware.js";
import { authController, blockStatusMiddleware, userController, serviceController, categoryController, bookingController, eventController, walletController, ticketController, workSampleController, dashboardController } from "../../di/resolver.js";



export class VendorRoute {
  public vendorRoute: Router;

   
   constructor(){
    this.vendorRoute = Router()
    this.setRoute()
   }
      private setRoute(): void{

          this.vendorRoute.put("/vendor/details",
            verifyAuth,
            // authorizeRole(["vendor"])
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res:Response) =>{
               userController.updateUserDetails(req,res)
            }
          )


          this.vendorRoute.put("/vendor/change-password",
            verifyAuth,
            // authorizeRole(["vendor"])
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res:Response) =>{
              userController.changePassword(req,res)
            }
          )

        

      /** ==========================
       *  Service Management Routes
      * ========================== */

          this.vendorRoute.post("/vendor/service",
            verifyAuth,
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res: Response) => {
              serviceController.addService(req,res)
            }
          )
          
          this.vendorRoute.get("/vendor/service",
            verifyAuth,
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res: Response) => {
              serviceController.getAllServices(req,res)
            }
          )


          this.vendorRoute.put("/vendor/service/:serviceId",
            verifyAuth,
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res: Response) => {
              serviceController.editService(req,res)
            }
          )


          this.vendorRoute.patch("/vendor/service/:serviceId",
            verifyAuth,
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res: Response) => {
              serviceController.updateServiceStatus(req,res)
            }
          )

          
          this.vendorRoute.get("/vendor/categories",
            verifyAuth,
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res: Response) => {
              categoryController.getAllCategories(req,res)
             }
            )






      /** ==========================
       *   Booking Management Routes
      * ========================== */ 

          this.vendorRoute.get("/vendor/bookings",
            verifyAuth,
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res: Response) => {
              bookingController.getAllBookings(req,res)
            })  


            this.vendorRoute.patch("/vendor/bookings/:bookingId",
              verifyAuth,
              blockStatusMiddleware.checkStatus as RequestHandler,
              (req: Request, res: Response) => {
                bookingController.updateBookingStatus(req,res)
              })



          
      /** ==========================
       *  Event Management Routes
      * ========================== */

      this.vendorRoute.get("/vendor/event",
        verifyAuth,
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          eventController.getAllEventsByVendorId(req,res)
        })


      this.vendorRoute.post("/vendor/event",
        verifyAuth,
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          eventController.createEvent(req,res)
        })  

        this.vendorRoute.put("/vendor/event/:eventId",
          verifyAuth,
          blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res: Response) => {
            eventController.editEvent(req,res)
          })
            

         this.vendorRoute.get("/vendor/events/attendees/:eventId",
          verifyAuth,
          blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res: Response) => {
            eventController.getAttendeesById(req,res)
          })




          
      /** ==========================
       *  Ticket Management Routes
      * ========================== */

      this.vendorRoute.get("/vendor/verify-ticket/:ticketId/:eventId",
        verifyAuth,
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          ticketController.verifyTicket(req,res)
        })




      /** ==========================
       *  Wallet Management Routes
      * ========================== */

      this.vendorRoute.get("/vendor/wallet",
      verifyAuth,
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        walletController.getWalletById(req,res)
      })

      


      /** ==========================
       *  Work Sample Management Routes
      * ========================== */

      this.vendorRoute.get("/vendor/work-sample",
        verifyAuth,
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          workSampleController.getAllWorkSamplesByVendorId(req,res)
        })

      this.vendorRoute.post("/vendor/work-sample",
        verifyAuth,
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          workSampleController.createWorkSample(req,res)
        })

        this.vendorRoute.put("/vendor/work-sample/:workSampleId",
          verifyAuth,
          blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res: Response) => {
            workSampleController.updateWorkSample(req,res)
          })



      /** ==========================
       *  Dashboard Management Routes
      * ========================== */         
     
         this.vendorRoute.get("/vendor/dashboard",
           verifyAuth,
           blockStatusMiddleware.checkStatus as RequestHandler,
           (req: Request, res: Response) => {
             dashboardController.getAllDashboardData(req,res)
           })



      /** ==========================
       *  Session Management Routes
      * ========================== */         
     
      this.vendorRoute.post('/vendor/logout',
           verifyAuth,
          //  authorizeRole(["vendor"])
           blockStatusMiddleware.checkStatus as RequestHandler,
           (req: Request,res:Response) =>{
           authController.logout(req, res)
           })
     
    
         this.vendorRoute.post('/vendor/refresh-token',
          decodeToken,
         (req:Request, res:Response) =>{
         console.log("refreshing Admin",req.body)
          authController.handleTokenRefresh(req, res)
           })
                    

   }
}