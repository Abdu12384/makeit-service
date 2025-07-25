"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisTokenRepository = void 0;
const tsyringe_1 = require("tsyringe");
const redis_client_1 = require("../../../frameworks/cashe/redis.client");
let RedisTokenRepository = class RedisTokenRepository {
    blackListToken(token, expiresIn) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_client_1.redisClient.set(token, "blacklisted", { EX: expiresIn });
        });
    }
    isTokenBlackListed(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield redis_client_1.redisClient.get(token);
            return result === "blacklisted";
        });
    }
    // Reset token
    storeResetToken(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `reset_token:${userId}`;
            yield redis_client_1.redisClient.setEx(key, 300, token);
        });
    }
    verifyResetToken(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `reset_token:${userId}`;
            const storedToken = yield redis_client_1.redisClient.get(key);
            return storedToken === token;
        });
    }
    deleteResetToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `reset_token:${userId}`;
            yield redis_client_1.redisClient.del(key);
        });
    }
    setEventLock(clientId_1, eventId_1) {
        return __awaiter(this, arguments, void 0, function* (clientId, eventId, durationInSeconds = 600) {
            const key = `ticket_lock:${clientId}:${eventId}`;
            yield redis_client_1.redisClient.set(key, "locked", { EX: durationInSeconds });
        });
    }
    isEventLocked(clientId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `ticket_lock:${clientId}:${eventId}`;
            const result = yield redis_client_1.redisClient.get(key);
            return result === "locked";
        });
    }
    deleteEventLock(clientId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `ticket_lock:${clientId}:${eventId}`;
            yield redis_client_1.redisClient.del(key);
        });
    }
};
exports.RedisTokenRepository = RedisTokenRepository;
exports.RedisTokenRepository = RedisTokenRepository = __decorate([
    (0, tsyringe_1.injectable)()
], RedisTokenRepository);
//# sourceMappingURL=redis-token.repository.js.map