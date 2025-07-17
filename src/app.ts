import express,{Express, urlencoded} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookie_parser from 'cookie-parser'
import morgan from 'morgan'
import { conncetMongo } from './frameworks/database/connection/dbConnect'
import {Server as HttpServer,createServer} from 'http'
import 'reflect-metadata'
import { DependencyInjection } from './frameworks/di/index'
import { ClientRoute } from './frameworks/routes/client/clientRoute'
import { AuthRoute } from './frameworks/routes/auth/authRoute'
import { AdminRoute } from './frameworks/routes/admin/adminRoute'
import { VendorRoute } from './frameworks/routes/vendor/vendorRoute'
import { SocketConfig } from './interfaceAdapters/websocket/socket.server'
import { IChatUseCase } from './domain/interface/useCaseInterface/chat/chat-usecaes.interface'
import { container } from 'tsyringe'
import morganLogger from './shared/utils/morgan.logger'

export class App {
   private app: Express
   private server:HttpServer
   private database:conncetMongo
   private socket:SocketConfig

   constructor(){
         dotenv.config()
         this.app = express()
         this.server = createServer(this.app)

         DependencyInjection.registerAll()

         this.database = new conncetMongo()
         this.database.connectDB()

         this.setMiddlewares()
         this.setRoutes()
         const chatUseCase = container.resolve<IChatUseCase>("IChatUseCase")
         this.socket = new SocketConfig(this.server, chatUseCase)
        }

   private setMiddlewares(){
        this.app.use(cors({
          origin: process.env.ORIGIN,
          methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
          allowedHeaders:["Authorization","Content-Type"],
          credentials:true
        }))
        this.app.use(cookie_parser())
        this.app.use(express.json())
        this.app.use(urlencoded({extended:true}))
        // this.app.use(morgan('dev'))
        this.app.use(morganLogger)
       }

      private setRoutes(){
        this.app.use('/auth',new AuthRoute().authRoute)
        this.app.use('/client', new ClientRoute().clientRoute)
        this.app.use('/admin',new AdminRoute().adminRoute)
        this.app.use('/vendor', new VendorRoute().vendorRoute )
      } 

   public listen(){
         const port = process.env.PORT || 3000

          this.server.listen(port,()=>console.log(`server running on ${port}`))
        }
         
   
}


const app = new App()
app.listen()