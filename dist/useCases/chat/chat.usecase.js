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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.ChatUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
let ChatUseCase = class ChatUseCase {
    constructor(chatRepository, clientRepository, vendorRepository, pushNotificationService) {
        this.chatRepository = chatRepository;
        this.clientRepository = clientRepository;
        this.vendorRepository = vendorRepository;
        this.pushNotificationService = pushNotificationService;
    }
    //======================================================
    startChat(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, senderModel, receiverId, receiverModel } = data;
            if (!senderId || !senderModel || !receiverId || !receiverModel) {
                throw new Error("All fields are required");
            }
            if (senderId === receiverId) {
                throw new Error("Cannot start a chat with yourself");
            }
            const chatId = (0, unique_uuid_helper_1.generateUniqueId)();
            yield this.chatRepository.findOrCreateChat(senderId, senderModel, receiverId, receiverModel, chatId);
            return chatId;
        });
    }
    //======================================================
    sendMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { chatId, senderId, senderModel, messageContent } = data;
            if (!chatId || !senderId || !senderModel || !messageContent) {
                throw new Error("Chat ID, sender ID, sender model, and message content are required");
            }
            const chat = yield this.chatRepository.findOne({ chatId });
            if (!chat || (chat.senderId !== senderId && chat.receiverId !== senderId)) {
                throw new Error("Unauthorized to send message in this chat");
            }
            const messageId = (0, unique_uuid_helper_1.generateUniqueId)();
            const sendedTime = new Date();
            const newMessage = yield this.chatRepository.saveMessage({
                chatId,
                senderId,
                senderModel,
                messageContent,
                sendedTime,
                messageId,
            });
            yield this.chatRepository.updateChatLastMessage(chatId, messageContent, sendedTime.toISOString());
            const receiverId = chat.senderId === senderId ? chat.receiverId : chat.senderId;
            const receiverModel = chat.senderId === senderId ? chat.receiverModel : chat.senderModel;
            yield this.findUserById(receiverId, receiverModel);
            const sender = yield this.findUserById(senderId, senderModel);
            yield this.pushNotificationService.sendNotification(receiverId, "New Message", `You have a new message from ${sender === null || sender === void 0 ? void 0 : sender.name}`, "new_message", receiverModel);
            return newMessage;
        });
    }
    //======================================================
    getMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!chatId) {
                throw new Error("Chat ID is required");
            }
            const messages = yield this.chatRepository.getMessages(chatId);
            return messages;
        });
    }
    //======================================================
    //======================================================
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("User ID is required");
            }
            const chats = yield this.chatRepository.getUserChats(userId);
            // Enrich chats with receiver details
            const enrichedChats = yield Promise.all(chats.map((chat) => __awaiter(this, void 0, void 0, function* () {
                const receiverId = chat.senderId === userId ? chat.receiverId : chat.senderId;
                const receiverModel = chat.senderId === userId ? chat.receiverModel : chat.senderModel;
                const receiver = yield this.findUserById(receiverId, receiverModel);
                return Object.assign(Object.assign({}, chat), { receiverName: (receiver === null || receiver === void 0 ? void 0 : receiver.name) || receiverId, receiverProfileImage: (receiver === null || receiver === void 0 ? void 0 : receiver.profileImage) || undefined });
            })));
            return enrichedChats;
        });
    }
    //======================================================
    markMessagesAsSeen(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!chatId || !userId) {
                throw new Error("Chat ID and user ID are required");
            }
            const chat = yield this.chatRepository.findOne({ chatId });
            if (!chat || (chat.senderId !== userId && chat.receiverId !== userId)) {
                throw new Error("Unauthorized to view this chat");
            }
            yield this.chatRepository.markMessagesAsSeen(chatId, userId);
        });
    }
    //======================================================
    findUserById(userId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("User ID is required");
            }
            if (model === "client") {
                return yield this.clientRepository.findOne({ userId });
            }
            else {
                return yield this.vendorRepository.findOne({ userId });
            }
        });
    }
    //======================================================
    getChatById(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!chatId) {
                throw new Error("Chat ID is required");
            }
            const chat = yield this.chatRepository.findOne({ chatId });
            if (!chat) {
                throw new Error("Chat not found");
            }
            return chat;
        });
    }
};
exports.ChatUseCase = ChatUseCase;
exports.ChatUseCase = ChatUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IChatRepository")),
    __param(1, (0, tsyringe_1.inject)("IClientRepository")),
    __param(2, (0, tsyringe_1.inject)("IVendorRepository")),
    __param(3, (0, tsyringe_1.inject)("IPushNotificationService")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ChatUseCase);
//# sourceMappingURL=chat.usecase.js.map