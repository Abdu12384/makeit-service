import { Request,RequestHandler,Response,Router } from "express";
import { authController, blockStatusMiddleware, bookingController, categoryController, dashboardController, eventController, userController, vendorController, walletController } from "../../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware";



export class AdminRoute {
  public adminRoute: Router;

   
   constructor(){
    this.adminRoute = Router()
    this.setRoute()
   }
     private setRoute(): void{


    /** =========================
     *  User Management Routes
     * ========================= */

     this.adminRoute.get('/admin/users',verifyAuth,authorizeRole(['admin']),(req: Request, res: Response) =>{
        userController.getAllUsers(req,res) 
     })

     this.adminRoute.patch('/admin/user/status',verifyAuth,authorizeRole(['admin']),(req:Request, res:Response) =>{
         userController.updateUserStatus(req,res)
     })




   /** ==========================
       *  Vendor Management Routes
      * ========================== */

     this.adminRoute.get("/admin/vendors",verifyAuth,authorizeRole(['admin']),(req:Request, res:Response) => {
         vendorController.getAllVendors(req, res)
     })

     this.adminRoute.put('/admin/vendor/:vendorId',verifyAuth,authorizeRole(['admin']),(req:Request, res:Response) =>{
         vendorController.updateVendorStatus(req,res)
     })



      /** ==========================
       *  Session  Routes
      * ========================== */

     this.adminRoute.post('/admin/refresh-token',
      decodeToken,
      (req:Request, res:Response) =>{
        authController.handleTokenRefresh(req, res)
     })
     
     this.adminRoute.get("/admin/refresh-session",
      verifyAuth,blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res:Response) =>{
        userController.refreshSession(req,res)
     })





      /** ==========================
       *  Dashboard Routes
      * ========================== */

     this.adminRoute.get('/admin/dashboard',verifyAuth,authorizeRole(['admin']),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res:Response) =>{
        dashboardController.getAllDashboardData(req,res)
     })





      /** ==========================
       *  Category Management Routes
      * ========================== */

     this.adminRoute.post('/admin/category',
      verifyAuth,authorizeRole(['admin']),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request, res:Response) =>{
         categoryController.createCategory(req,res)
     })

     this.adminRoute.get('/admin/category',
      verifyAuth,authorizeRole(['admin']),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request, res:Response) =>{
         categoryController.getAllCategories(req,res)
     })

     this.adminRoute.patch('/admin/category/:id',
      verifyAuth,authorizeRole(['admin']),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request, res:Response) =>{
         categoryController.updateCategoryStatus(req,res)
     })

     this.adminRoute.put('/admin/category/:id',
      verifyAuth,authorizeRole(['admin']),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request, res:Response) =>{
         categoryController.editCategory(req,res)
     })






      /** ==========================
       *  Wallet Management Routes
      * ========================== */

     this.adminRoute.get('/admin/wallet',
      verifyAuth,authorizeRole(['admin']),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request, res:Response) =>{
         walletController.getWalletById(req,res)
     })

     

     this.adminRoute.get('/admin/events',
      verifyAuth,authorizeRole(['admin']),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request, res:Response) =>{
         eventController.getAllEvents(req,res)
     })


     this.adminRoute.get('/admin/bookings',
      verifyAuth,authorizeRole(['admin']),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request, res:Response) =>{
         bookingController.getAllBookings(req,res)
     })


     // logout
     // ---------
     this.adminRoute.post("/admin/logout",verifyAuth,
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res:Response) =>{
       authController.logout(req,res)
     })

    


        
   }

} 