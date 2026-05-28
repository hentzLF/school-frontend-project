"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CONVERSATION_ROUTES } from "@/config/constants";
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
} from "@/types/conversation";

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: () => api<Conversation[]>(CONVERSATION_ROUTES.list),
  });
}

export function useMessages(conversationId: string) {
  return useQuery<Message[]>({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => api<Message[]>(CONVERSATION_ROUTES.messages(conversationId)),
    enabled: !!conversationId,
    refetchInterval: 10000,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, CreateConversationRequest>({
    mutationFn: ({ participantProfileId, bookingId }) =>
      api<Conversation>(CONVERSATION_ROUTES.list, {
        method: "POST",
        body: { participantProfileId, bookingId },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, SendMessageRequest>({
    mutationFn: (data) =>
      api<Message>(CONVERSATION_ROUTES.messages(conversationId), {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations", conversationId, "messages"],
      });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
