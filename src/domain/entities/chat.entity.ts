export interface IChatEntity {
      chatId:string,
      lastMessage:string,
      lastMessageAt:string,
      receiverId:string,
      senderId:string,
      receiverModel:"client" | "vendor",
      senderModel:"client" | "vendor",
      createdAt:string,
      updatedAt:string,
      receiverName?:string,
      receiverProfileImage?:string,
      name:string,
      profileImage?:string,
      fcmToken?:string      
}
