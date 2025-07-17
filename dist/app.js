"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_1 = require("./frameworks/database/connection/dbConnect");
const http_1 = require("http");
require("reflect-metadata");
const index_1 = require("./frameworks/di/index");
const clientRoute_1 = require("./frameworks/routes/client/clientRoute");
const authRoute_1 = require("./frameworks/routes/auth/authRoute");
const adminRoute_1 = require("./frameworks/routes/admin/adminRoute");
const vendorRoute_1 = require("./frameworks/routes/vendor/vendorRoute");
const socket_server_1 = require("./interfaceAdapters/websocket/socket.server");
const tsyringe_1 = require("tsyringe");
const morgan_logger_1 = __importDefault(require("./shared/utils/morgan.logger"));
class App {
    constructor() {
        dotenv_1.default.config();
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
        index_1.DependencyInjection.registerAll();
        this.database = new dbConnect_1.conncetMongo();
        this.database.connectDB();
        this.setMiddlewares();
        this.setRoutes();
        const chatUseCase = tsyringe_1.container.resolve("IChatUseCase");
        this.socket = new socket_server_1.SocketConfig(this.server, chatUseCase);
    }
    setMiddlewares() {
        this.app.use((0, cors_1.default)({
            origin: process.env.ORIGIN,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Authorization", "Content-Type"],
            credentials: true
        }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(express_1.default.json());
        this.app.use((0, express_1.urlencoded)({ extended: true }));
        // this.app.use(morgan('dev'))
        this.app.use(morgan_logger_1.default);
    }
    setRoutes() {
        this.app.use('/auth', new authRoute_1.AuthRoute().authRoute);
        this.app.use('/client', new clientRoute_1.ClientRoute().clientRoute);
        this.app.use('/admin', new adminRoute_1.AdminRoute().adminRoute);
        this.app.use('/vendor', new vendorRoute_1.VendorRoute().vendorRoute);
    }
    listen() {
        const port = process.env.PORT || 3000;
        this.server.listen(port, () => console.log(`server running on ${port}`));
    }
}
exports.App = App;
const app = new App();
app.listen();
//# sourceMappingURL=app.js.map