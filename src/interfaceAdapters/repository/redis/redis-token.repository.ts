import { injectable } from "tsyringe";
import { redisClient } from "../../../frameworks/cashe/redis.client";
import { IRedisTokenRepository } from "../../../domain/interface/repositoryInterfaces/redis/redis-token-repository.interface";

@injectable()
export class RedisTokenRepository implements IRedisTokenRepository {
	async blackListToken(token: string, expiresIn: number): Promise<void> {
		await redisClient.set(token, "blacklisted", { EX: expiresIn });
	}

	async isTokenBlackListed(token: string): Promise<boolean> {
		const result = await redisClient.get(token);
		return result === "blacklisted";
	}

	// Reset token
	async storeResetToken(userId: string, token: string): Promise<void> {
		const key = `reset_token:${userId}`;
		await redisClient.setEx(key, 300, token);
	}

	async verifyResetToken(userId: string, token: string): Promise<boolean> {
		const key = `reset_token:${userId}`;
		const storedToken = await redisClient.get(key);
		return storedToken === token;
	}

	async deleteResetToken(userId: string) {
		const key = `reset_token:${userId}`;
		await redisClient.del(key);
	}

	async setEventLock(clientId: string, eventId: string, durationInSeconds: number = 600): Promise<void> {
		const key = `ticket_lock:${clientId}:${eventId}`;
		await redisClient.set(key, "locked", { EX: durationInSeconds });
	}
	
	async isEventLocked(clientId: string, eventId: string): Promise<boolean> {
		const key = `ticket_lock:${clientId}:${eventId}`;
		const result = await redisClient.get(key);
		return result === "locked";
	}

	async deleteEventLock(clientId: string, eventId: string): Promise<void> {
		const key = `ticket_lock:${clientId}:${eventId}`;
		await redisClient.del(key);
	}	
}
