"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.getMessaging = exports.firebaseReady = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
dotenv_1.default.config();
// 🔁 Service account path
const serviceAccountPath = path_1.default.resolve(__dirname, "../../", process.env.FIREBASE_SERVICE_ACCOUNT || "");
// 👇 Delay messaging export
let messagingInstance;
function initializeFirebase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileContent = yield promises_1.default.readFile(serviceAccountPath, "utf-8");
            const serviceAccount = JSON.parse(fileContent);
            if (!firebase_admin_1.default.apps.length) {
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert(serviceAccount),
                });
                // ✅ Set messaging only after init
                messagingInstance = firebase_admin_1.default.messaging();
            }
        }
        catch (error) {
            console.error("❌ Firebase init failed:", error);
            throw new Error("Firebase Admin SDK failed to initialize");
        }
    });
}
// ⛳ Call this in your main.ts/server.ts or service
exports.firebaseReady = initializeFirebase();
// ❗ Do not access messaging until after firebaseReady is awaited
const getMessaging = () => {
    if (!messagingInstance) {
        throw new Error("❌ Firebase has not been initialized yet.");
    }
    return messagingInstance;
};
exports.getMessaging = getMessaging;
// Other config (as you already have)
exports.config = {
    loggerStatus: process.env.LOGGER_STATUS || "combined",
    adminId: process.env.ADMIN_ID || "",
    ORIGIN: process.env.ORIGIN,
    server: {
        PORT: process.env.PORT || 5000,
        NODE_ENV: process.env.NODE_ENV || "development",
    },
    jwt: {
        ACCESS_SECRET_KEY: process.env.JWT_ACCESS_KEY || "access-secret-key",
        REFRESH_SECRET_KEY: process.env.JWT_REFRESH_KEY || "refresh-secret-key",
        RESET_SECRET_KEY: process.env.JWT_RESET_KEY || "reset-secret-key",
        ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        RESET_EXPIRES_IN: process.env.JWT_RESET_EXPIRES_IN || "5m",
    },
    redis: {
        REDIS_USERNAME: process.env.REDIS_USERNAME || "default",
        REDIS_PASS: process.env.REDIS_PASS,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT || "14402",
    },
};
//# sourceMappingURL=config.js.map