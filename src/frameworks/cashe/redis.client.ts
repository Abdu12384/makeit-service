import { createClient } from "redis";
import { config } from "../../shared/config";


export const redisClient = createClient({
	username: config.redis.REDIS_USERNAME,
	password: config.redis.REDIS_PASS,
	socket: {
		host: config.redis.REDIS_HOST,
		port: parseInt(config.redis.REDIS_PORT),
	},
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
	await redisClient.connect();
	console.log("📦 Redis connected successfully!")
})();
