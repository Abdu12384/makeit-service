import { Request,RequestHandler,Response,Router } from "express";
import { authController, blockStatusMiddleware, userController, serviceController, bookingController, paymentController, eventController, ticketController, walletController, reviewController, workSampleController, notificationController, categoryController } from "../../di/resolver";
import { decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";
import { validateDto } from "../../../interfaceAdapters/middlewares/validation.middleware";
import { BookingDto } from "../../../shared/dtos/request/booking-requst.dto";



export class ClientRoute {
  public clientRoute: Router;

   
   constructor(){
    this.clientRoute = Router()
    this.setRoute()
   }
      private setRoute(): void{


         this.clientRoute.put("/client/details",
         verifyAuth,
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
       *  saveFCMToken
      * ========================== */
         
         this.clientRoute.post("/client/save-fcm-token",
         verifyAuth,
         blockStatusMiddleware.checkStatus as RequestHandler,
         (req: Request, res:Response) =>{
           userController.saveFCMToken(req,res)
         })


      /** ==========================
       *  getClientNotifications
      * ========================== */
         this.clientRoute.get("/client/notifications",
         verifyAuth,
         blockStatusMiddleware.checkStatus as RequestHandler,
         (req: Request, res:Response) =>{
           notificationController.getNotifications(req,res)
         })

         this.clientRoute.put("/client/notifications/read",
         verifyAuth,
         blockStatusMiddleware.checkStatus as RequestHandler,
         (req: Request, res:Response) =>{
           notificationController.markNotificationAsRead(req,res)
         })


        /** ==========================
         *  Client Service Management Routes
        * ========================== */

        this.clientRoute.get("/client/services",
          (req: Request, res:Response) =>{
            serviceController.getAllServices(req,res)
          })


          this.clientRoute.get("/client/services/:serviceId",
          (req: Request, res:Response) =>{
            serviceController.getServiceById(req,res)
          })  

          this.clientRoute.get("/client/categories",
          verifyAuth,
          blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res:Response) =>{
            categoryController.getAllCategories(req,res)
          })


        this.clientRoute.put("/client/profile",
          verifyAuth,
          blockStatusMiddleware.checkStatus as RequestHandler,
          (req: Request, res:Response) =>{
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
        validateDto(BookingDto),
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
            verifyAuth,
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request, res:Response) =>{
              paymentController.confirmPayment(req,res)
            })  


            this.clientRoute.put("/client/cancel-booking/:bookingId",
              verifyAuth,
              blockStatusMiddleware.checkStatus as RequestHandler,
              (req: Request, res:Response) =>{
                bookingController.cancelBooking(req,res)
              })


              this.clientRoute.patch("/client/bookings/:bookingId/reschedule",
                verifyAuth,
                blockStatusMiddleware.checkStatus as RequestHandler,
                (req: Request, res: Response) => {
                  bookingController.approveOrRejectRescheduleBooking(req,res)
                })
            




      /** ==========================
       *  Client Event  Routes
      * ========================== */

       this.clientRoute.get("/client/events",
       (req: Request, res:Response) =>{
         eventController.getAllEvents(req,res)
       }) 


       this.clientRoute.get("/client/events/:eventId",
       (req: Request, res:Response) =>{
         eventController.getEventById(req,res)
       })


       this.clientRoute.get("/client/events/:eventId/check-booking",
       verifyAuth,
       blockStatusMiddleware.checkStatus as RequestHandler,
       (req: Request, res:Response) =>{
         eventController.checkEventBookingAvailability(req,res)
       })

       this.clientRoute.get("/nearby",
       (req: Request, res:Response) =>{
         eventController.getAllEventsByLocation(req,res)
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
            blockStatusMiddleware.checkStatus as RequestHandler,
            (req: Request,res:Response) =>{
             authController.logout(req, res)
          })


          this.clientRoute.post( "/client/refresh-token",
            decodeToken,
            (req: Request, res: Response) => {
              authController.handleTokenRefresh(req, res);
            }
          )
           
        }
}