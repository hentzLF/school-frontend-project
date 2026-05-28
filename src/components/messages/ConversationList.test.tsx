import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ConversationList } from "./ConversationList";
import type { Conversation } from "@/types/conversation";

afterEach(cleanup);

vi.mock("@/hooks/useConversations", () => ({
  useConversations: vi.fn(),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "common.loading": "Loading...",
        "messages.loadError": "Failed to load messages",
        "messages.title": "Messages",
        "messages.noConversations": "No conversations yet",
        "dashboard.messagesDesc": "Chat with other users",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

const mockConversation: Conversation = {
  id: "conv-1",
  bookingId: null,
  otherParticipant: { profileId: "user-2", fullName: "Alice, Bob" },
  lastMessage: { content: "Hello there!", senderProfileId: "user-1", sentAt: "2026-05-01T10:00:00Z" },
  unreadCount: 0,
  createdAt: "2026-04-01T00:00:00Z",
};

describe("ConversationList", () => {
  it("should render loading state", async () => {
    const { useConversations } = await import("@/hooks/useConversations");
    vi.mocked(useConversations).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useConversations>);

    render(<ConversationList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render error state", async () => {
    const { useConversations } = await import("@/hooks/useConversations");
    vi.mocked(useConversations).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed"),
    } as ReturnType<typeof useConversations>);

    render(<ConversationList />);
    expect(screen.getByText("Failed to load messages")).toBeInTheDocument();
  });

  it("should render empty state when no conversations", async () => {
    const { useConversations } = await import("@/hooks/useConversations");
    vi.mocked(useConversations).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useConversations>);

    render(<ConversationList />);
    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
  });

  it("should render conversation with participant names and last message", async () => {
    const { useConversations } = await import("@/hooks/useConversations");
    vi.mocked(useConversations).mockReturnValue({
      data: [mockConversation],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useConversations>);

    render(<ConversationList />);
    expect(screen.getByText("Alice, Bob")).toBeInTheDocument();
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("should link to the conversation detail page", async () => {
    const { useConversations } = await import("@/hooks/useConversations");
    vi.mocked(useConversations).mockReturnValue({
      data: [mockConversation],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useConversations>);

    render(<ConversationList />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/messages/conv-1");
  });
});
