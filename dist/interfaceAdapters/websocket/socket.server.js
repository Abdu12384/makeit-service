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
import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { inject } from "tsyringe";
let SocketConfig = class SocketConfig {
    _chatUseCase;
    io;
    constructor(server, _chatUseCase) {
        this._chatUseCase = _chatUseCase;
        this.io = new SocketIOServer(server, {
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
            console.log("a user connected: ", socket.id);
            //==========================================================
            //  socket.on("register", async (data: { userId: string; name: string }, response) => {
            //   try {
            //     // Fetch notifications for the user
            //     const notifications = await this.notificationDatabase.findNotifications(data.userId);
            //     response(notifications);
            //     // // Store user data in Redis and the users map
            //     // await this.redisService.set(data.userId, 86400, JSON.stringify({ socketId: socket.id, name: data.name }));
            //     // this.users.set(data.userId, { socketId: socket.id, name: data.name });
            //     // socket.data.userId = data.userId;
            //     // // Optionally join the user to their own room for notifications (already done in users map)
            //     // socket.join(data.userId);
            //   } catch (error: any) {
            //     console.error("Error registering user:", error);
            //     response({ status: "error", message: error.message });
            //   }
            // });
            //==========================================================
            socket.on("start-chat", async (data, response) => {
                try {
                    const chatId = await this._chatUseCase.startChat(data);
                    socket.join(chatId);
                    socket.join(data.senderId); // For notifications
                    response({ status: "success", chatId });
                }
                catch (error) {
                    console.error("Error starting chat:", error);
                    response({ status: "error", message: error.message });
                }
            });
            //==========================================================
            socket.on("get-chats", async (data, response) => {
                try {
                    const chats = await this._chatUseCase.getUserChats(data.userId);
                    response({ status: "success", data: chats });
                }
                catch (error) {
                    console.error("Error fetching chats:", error);
                    response({ status: "error", message: error.message });
                }
            });
            //==========================================================
            socket.on("join-room", async (data, response) => {
                try {
                    console.log("join-room", data);
                    await this._chatUseCase.markMessagesAsSeen(data.roomId, data.userId);
                    socket.join(data.roomId);
                    socket.join(data.userId);
                    console.log(`user ${socket.id} joined room: ${data.roomId}`);
                    socket.to(data.roomId).emit("user-joined", { userId: data.userId });
                    response({ status: "success", message: "Joined room successfully" });
                }
                catch (error) {
                    console.error("Error joining room:", error);
                    response({ status: "error", message: error.message });
                }
            });
            //==========================================================
            socket.on("send-message", async (data, response) => {
                try {
                    const message = await this._chatUseCase.sendMessage({
                        chatId: data.chatId,
                        senderId: data.senderId,
                        senderModel: data.senderModel,
                        messageContent: data.message,
                    });
                    console.log("chatId -------------------------------------------", data.chatId);
                    this.io.to(data.chatId).emit("receive-message", message);
                    const chat = await this._chatUseCase.getChatById(data.chatId);
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
            });
            //==========================================================
            socket.on("get-messages", async (data, response) => {
                try {
                    const messages = await this._chatUseCase.getMessages(data.chatId, data.skip || 0, data.limit || 20);
                    response({ status: "success", data: messages });
                }
                catch (error) {
                    console.error("Error fetching messages:", error);
                    response({ status: "error", message: error.message });
                }
            });
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
SocketConfig = __decorate([
    __param(1, inject("IChatUseCase")),
    __metadata("design:paramtypes", [HttpServer, Object])
], SocketConfig);
export { SocketConfig };
//# sourceMappingURL=socket.server.js.map