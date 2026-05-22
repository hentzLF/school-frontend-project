import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api", () => ({
  api: vi.fn(),
}));

import { api } from "@/lib/api";
import {
  useConversations,
  useMessages,
  useCreateConversation,
  useSendMessage,
} from "./useConversations";
import type { Conversation, Message } from "@/types/conversation";

const mockApi = vi.mocked(api);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

const mockConversation: Conversation = {
  id: "conv1",
  participantIds: ["u1", "u2"],
  participantNames: ["Alice", "Bob"],
  lastMessage: "Hello",
  lastMessageAt: "2026-01-01T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
};

const mockMessage: Message = {
  id: "msg1",
  conversationId: "conv1",
  senderId: "u1",
  senderName: "Alice",
  content: "Hello there!",
  createdAt: "2026-01-01T00:00:00Z",
};

describe("useConversations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the list of conversations", async () => {
    mockApi.mockResolvedValue([mockConversation]);

    const { result } = renderHook(() => useConversations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockConversation]);
    expect(mockApi).toHaveBeenCalledWith("/api/conversations");
  });
});

describe("useMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch messages for a conversation", async () => {
    mockApi.mockResolvedValue([mockMessage]);

    const { result } = renderHook(() => useMessages("conv1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockMessage]);
    expect(mockApi).toHaveBeenCalledWith("/api/conversations/conv1/messages");
  });

  it("should remain idle when no conversationId is provided", () => {
    const { result } = renderHook(() => useMessages(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCreateConversation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with POST and conversation data", async () => {
    mockApi.mockResolvedValue(mockConversation);

    const { result } = renderHook(() => useCreateConversation(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      participantId: "u2",
      message: "Hello!",
    });

    expect(mockApi).toHaveBeenCalledWith("/api/conversations", {
      method: "POST",
      body: { participantId: "u2", message: "Hello!" },
    });
  });
});

describe("useSendMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with POST and message content", async () => {
    mockApi.mockResolvedValue(mockMessage);

    const { result } = renderHook(() => useSendMessage("conv1"), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ content: "Hello there!" });

    expect(mockApi).toHaveBeenCalledWith("/api/conversations/conv1/messages", {
      method: "POST",
      body: { content: "Hello there!" },
    });
  });
});
