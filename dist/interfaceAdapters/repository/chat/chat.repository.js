"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.ChatRepository = void 0;
const chat_model_1 = require("../../../frameworks/database/mongodb/model/chat.model");
const base_repository_1 = require("../base.repository");
const message_model_1 = require("../../../frameworks/database/mongodb/model/message.model");
const tsyringe_1 = require("tsyringe");
let ChatRepository = class ChatRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(chat_model_1.chatModel);
    }
    findOrCreateChat(senderId, senderModel, receiverId, receiverModel, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            let chat = yield chat_model_1.chatModel.findOne({
                $or: [
                    { senderId, senderModel, receiverId, receiverModel, chatId },
                    { senderId: receiverId, senderModel: receiverModel, receiverId: senderId, receiverModel: senderModel, chatId },
                ],
            }).lean();
            if (!chat) {
                const newChat = yield this.save({
                    senderId,
                    senderModel,
                    receiverId,
                    receiverModel,
                    chatId,
                    lastMessage: "",
                    lastMessageAt: "",
                });
                return newChat;
            }
            return chat;
        });
    }
    saveMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new message_model_1.messageModel(Object.assign(Object.assign({}, message), { seen: false }));
            const savedMessage = yield newMessage.save();
            return savedMessage.toObject();
        });
    }
    updateChatLastMessage(chatId, lastMessage, lastMessageAt) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chat_model_1.chatModel.findOneAndUpdate({ chatId }, {
                lastMessage,
                lastMessageAt,
            }, { new: true });
        });
    }
    getMessages(chatId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield message_model_1.messageModel.find({ chatId })
                // .sort({ sendedTime: 1 })
                // .skip(skip)
                // .limit(limit)
                .lean();
        });
    }
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chat_model_1.chatModel.find({
                $or: [{ senderId: userId }, { receiverId: userId }],
            })
                .sort({ updatedAt: -1 })
                .lean();
        });
    }
    markMessagesAsSeen(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield message_model_1.messageModel.updateMany({ chatId, senderId: { $ne: userId }, seen: false }, { seen: true });
        });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ChatRepository);
//# sourceMappingURL=chat.repository.js.map