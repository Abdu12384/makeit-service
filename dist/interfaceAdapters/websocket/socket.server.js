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
exports.SocketConfig = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const tsyringe_1 = require("tsyringe");
let SocketConfig = class SocketConfig {
    constructor(server, _chatUseCase) {
        this._chatUseCase = _chatUseCase;
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.ORIGIN,
                methods: ["GET", "POST"],
                credentials: true
            },
        });
        this.initializeSockets();
    }
    //==========================================================
    initializeSockets() {
        this.io.on("connect", (socket) => {
            //==========================================================
            socket.on("start-chat", (data, response) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const chatId = yield this._chatUseCase.startChat(data);
                    socket.join(chatId);
                    socket.join(data.senderId); // For notifications
                    response({ status: "success", chatId });
                }
                catch (error) {
                    console.error("Error starting chat:", error);
                    response({ status: "error", message: error.message });
                }
            }));
            //==========================================================
            socket.on("get-chats", (data, response) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const chats = yield this._chatUseCase.getUserChats(data.userId);
                    response({ status: "success", data: chats });
                }
                catch (error) {
                    console.error("Error fetching chats:", error);
                    response({ status: "error", message: error.message });
                }
            }));
            //==========================================================
            socket.on("join-room", (data, response) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this._chatUseCase.markMessagesAsSeen(data.roomId, data.userId);
                    socket.join(data.roomId);
                    socket.join(data.userId);
                    socket.to(data.roomId).emit("user-joined", { userId: data.userId });
                    response({ status: "success", message: "Joined room successfully" });
                }
                catch (error) {
                    console.error("Error joining room:", error);
                    response({ status: "error", message: error.message });
                }
            }));
            //==========================================================
            socket.on("send-message", (data, response) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const message = yield this._chatUseCase.sendMessage({
                        chatId: data.chatId,
                        senderId: data.senderId,
                        senderModel: data.senderModel,
                        messageContent: data.message,
                    });
                    this.io.to(data.chatId).emit("receive-message", message);
                    const chat = yield this._chatUseCase.getChatById(data.chatId);
                    if (chat) {
                        const receiverId = chat.senderId === data.senderId ? chat.receiverId : chat.senderId;
                        const receiverModel = chat.senderId === data.senderId ? chat.receiverModel : chat.senderModel;
                        this.io.to(receiverId).emit("notification", {
                            type: "new-message",
                            chatId: data.chatId,
                            message: "You have a new message",
                        });
                    }
                    response({ status: "success", message: "Message sent successfully" });
                }
                catch (error) {
                    console.error("Error sending message:", error);
                    response({ status: "error", message: error.message });
                }
            }));
            //==========================================================
            socket.on("get-messages", (data, response) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const messages = yield this._chatUseCase.getMessages(data.chatId, data.skip || 0, data.limit || 20);
                    response({ status: "success", data: messages });
                }
                catch (error) {
                    console.error("Error fetching messages:", error);
                    response({ status: "error", message: error.message });
                }
            }));
            //==========================================================    
            socket.on("typing", (data) => {
                const { chatId, senderId, isTyping } = data;
                socket.to(chatId).emit("typing", { senderId, isTyping });
            });
            //==========================================================
            socket.on("disconnect", () => {
                console.log("user disconnected: ", socket.id);
            });
        });
    }
    getIo() {
        return this.io;
    }
};
exports.SocketConfig = SocketConfig;
exports.SocketConfig = SocketConfig = __decorate([
    __param(1, (0, tsyringe_1.inject)("IChatUseCase")),
    __metadata("design:paramtypes", [http_1.Server, Object])
], SocketConfig);
//# sourceMappingURL=socket.server.js.map