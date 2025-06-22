import dotenv from "dotenv"
import firebaseAdmin from "firebase-admin";
import path from 'path';
import { fileURLToPath } from "url";
import fs from "fs/promises";



dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ✅ Service account path from env
const serviceAccountPath = path.resolve(__dirname, "../../", process.env.FIREBASE_SERVICE_ACCOUNT || "");

console.log("serviceAccountPath////////////////////////s", serviceAccountPath);

let serviceAccount: firebaseAdmin.ServiceAccount;


try {
	const fileContent = await fs.readFile(serviceAccountPath, "utf-8");
	
  serviceAccount = JSON.parse(fileContent);
	console.log("fileContent////////////////////////s",serviceAccount)
} catch (error) {
  console.error("❌ Failed to load Firebase service account:", error);
  throw new Error("Firebase Admin SDK initialization failed due to missing or invalid service account file");
}


console.log("firebaseAdmin.initializeApp",firebaseAdmin.apps)
if (!firebaseAdmin?.apps?.length) {
	firebaseAdmin.initializeApp({
			credential: firebaseAdmin.credential.cert(serviceAccount),
	});
}

console.log("firebaseAdmin.initializeApp",firebaseAdmin.messaging())

export const messaging = firebaseAdmin.messaging();



export const config = {

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
		REDIS_PORT: process.env.REDIS_PORT || "14402" 
	}

     
}