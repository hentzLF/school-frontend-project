export type Conversation = {
  id: string;
  bookingId: string | null;
  otherParticipant: {
    profileId: string;
    fullName: string | null;
  };
  lastMessage: {
    content: string | null;
    senderProfileId: string;
    sentAt: string;
  } | null;
  unreadCount: number;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderProfileId: string;
  senderName: string | null;
  content: string | null;
  sentAt: string;
  isRead: boolean;
};

export type CreateConversationRequest = {
  participantProfileId: string;
  bookingId?: string;
};

export type SendMessageRequest = {
  content: string;
};
