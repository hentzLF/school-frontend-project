export type Conversation = {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
};

export type CreateConversationRequest = {
  participantId: string;
  message: string;
};

export type SendMessageRequest = {
  content: string;
};
