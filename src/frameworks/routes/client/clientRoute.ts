import { Request,RequestHandler,Response,Router } from "express";
import { authController, blockStatusMiddleware, userController, serviceController, bookingController, paymentController, eventController, ticketController, walletController, reviewController, workSampleController } from "../../di/resolver.js";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware.js";



export class ClientRoute {
  public clientRoute: Router;

   
   constructor(){
    this.clientRoute = Router()
    this.setRoute()
   }
      private setRoute(): void{


         this.clientRoute.put("/client/details",
         verifyAuth,
         // authorizeRole(["client"])
         blockStatusMiddleware.checkStatus as RequestHandler,
         (req: Request, res:Response) =>{
          userController.updateUserDetails(req,res)
          })


          this.clientRoute.put("/client/change-password",
          verifyAuth,
          blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res:Response) =>{
            userController.changePassword(req,res)
          })
         

        /** ==========================
         *  Client Service Management Routes
        * ========================== */

        this.clientRoute.get("/client/services",
          // verifyAuth,
          // authorizeRole(["client"])
          // blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res:Response) =>{
            serviceController.getAllServices(req,res)
          })


          this.clientRoute.get("/client/services/:serviceId",
          // verifyAuth,
          // blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res:Response) =>{
            serviceController.getServiceById(req,res)
          })  


        this.clientRoute.put("/client/profile",
          verifyAuth,
          blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res:Response) =>{
            console.log('client profile')
            userController.updateUserDetails(req,res)
          }   
        )






      /** ==========================
       *  Client Booking Management Routes
      * ========================== */

      this.clientRoute.get("/client/bookings",
        verifyAuth,
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res:Response) =>{
          bookingController.getAllBookings(req,res)
        })

      this.clientRoute.post("/client/services/:serviceId/book",
        verifyAuth,
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res:Response) =>{  
          bookingController.bookService(req,res)
        })



        this.clientRoute.post("/client/create-booking-payment",
          verifyAuth,
          blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res:Response) =>{
            paymentController.handleBookingPayment(req,res)
          })


          this.clientRoute.post("/client/confirm-payment",
            // verifyAuth,
            // blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res:Response) =>{
              paymentController.confirmPayment(req,res)
            })  


            this.clientRoute.put("/client/cancel-booking/:bookingId",
              // verifyAuth,
              // blockStatusMiddleware.checkStatus as RequestHandler,
              (req: Request, res:Response) =>{
                bookingController.cancelBooking(req,res)
              })





      /** ==========================
       *  Client Event  Routes
      * ========================== */

       this.clientRoute.get("/client/events",
      //  verifyAuth,
      //  blockStatusMiddleware.checkStatus as RequestHandler,
       (req: Request, res:Response) =>{
         eventController.getAllEvents(req,res)
       }) 


       this.clientRoute.get("/client/events/:eventId",
      //  verifyAuth,
      //  blockStatusMiddleware.checkStatus as RequestHandler,
       (req: Request, res:Response) =>{
         eventController.getEventById(req,res)
       })







      /** ==========================
       *  Client Ticket  Routes
      * ========================== */
     
     this.clientRoute.get("/client/tickets",
     verifyAuth,
     blockStatusMiddleware.checkStatus as RequestHandler,
     (req: Request, res:Response) =>{
       ticketController.getAllTicketsByClientId(req,res)
     }) 


       this.clientRoute.post("/client/create-ticket",
       verifyAuth, 
       blockStatusMiddleware.checkStatus as RequestHandler,
       (req: Request, res:Response) =>{
         ticketController.createTicket(req,res)
       })  



       this.clientRoute.post("/client/confirm-ticket-payment",
       verifyAuth, 
       blockStatusMiddleware.checkStatus as RequestHandler,
       (req: Request, res:Response) =>{
         ticketController.confirmTicketAndPayment(req,res)
       })
       



       this.clientRoute.put("/client/cancel-ticket/:ticketId",
        verifyAuth,
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res:Response) =>{
          ticketController.cancelTicket(req,res)
        })
 
 
 




      /** ==========================
       *  Client Wallet Management Routes
      * ========================== */
       
      this.clientRoute.get("/client/wallet",
      verifyAuth,
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res:Response) =>{
        walletController.getWalletById(req,res)
      })





      /** ==========================
       *  Client Review Management Routes
       * ========================== */

      
      this.clientRoute.get("/client/reviews",
      verifyAuth,
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res:Response) =>{
        reviewController.getAllReviews(req,res)
      })


       this.clientRoute.post("/client/review",
       verifyAuth,
       blockStatusMiddleware.checkStatus as RequestHandler,
       (req: Request, res:Response) =>{
         reviewController.createReview(req,res)
       })



      /** ==========================
       *  Client Vendor Work Sample Management Routes
       * ========================== */
      this.clientRoute.get("/client/work-sample/:vendorId",
      verifyAuth,
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res:Response) =>{
        workSampleController.getAllWorkSamplesByVendorId(req,res)
      })
    


      /** ==========================
       *  Client Session Management Routes
      * ========================== */

           // logout
          this.clientRoute.post('/client/logout',
            verifyAuth,
            // authorizeRole(["client"])
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request,res:Response) =>{
             authController.logout(req, res)
          })


          this.clientRoute.post( "/client/refresh-token",
            decodeToken,
            (req: Request, res: Response) => {
              console.log("refreshing client", req.body);
              authController.handleTokenRefresh(req, res);
            }
          )


           

        }
}