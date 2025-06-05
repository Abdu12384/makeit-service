export interface IMessageEntity {
    messageId: string;
    chatId: string;
    messageContent: string;
    seen: boolean;
    sendedTime: Date;
    senderId: string;
    senderModel: string;
}