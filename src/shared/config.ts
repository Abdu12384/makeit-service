import dotenv from "dotenv";
import firebaseAdmin from "firebase-admin";
import path from "path";
import fs from "fs/promises";

dotenv.config();

// 🔁 Service account path
const serviceAccountPath = path.resolve(__dirname, "../../", process.env.FIREBASE_SERVICE_ACCOUNT || "");

// 👇 Delay messaging export
let messagingInstance: firebaseAdmin.messaging.Messaging;

async function initializeFirebase() {
  try {
    const fileContent = await fs.readFile(serviceAccountPath, "utf-8");
    const serviceAccount: firebaseAdmin.ServiceAccount = JSON.parse(fileContent);

    if (!firebaseAdmin.apps.length) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
      });

      // ✅ Set messaging only after init
      messagingInstance = firebaseAdmin.messaging();
    }
  } catch (error) {
    console.error("❌ Firebase init failed:", error);
    throw new Error("Firebase Admin SDK failed to initialize");
  }
}

// ⛳ Call this in your main.ts/server.ts or service
export const firebaseReady = initializeFirebase();

// ❗ Do not access messaging until after firebaseReady is awaited
export const getMessaging = (): firebaseAdmin.messaging.Messaging => {
  if (!messagingInstance) {
    throw new Error("❌ Firebase has not been initialized yet.");
  }
  return messagingInstance;
};

// Other config (as you already have)
export const config = {

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
