"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useMessages, useSendMessage } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";

type MessageThreadProps = {
  conversationId: string;
};

export function MessageThread({ conversationId }: MessageThreadProps) {
  const { user } = useAuth();
  const { data: messages, isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await sendMessage.mutateAsync({ content: content.trim() });
      setContent("");
    } catch {
      // Error captured by mutation
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <Link href="/messages" className="text-sm text-green-600 hover:text-green-700">
          &larr; Back to conversations
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-white p-4 space-y-3">
        {isLoading && <p className="text-gray-500">Loading messages...</p>}

        {messages?.map((message) => {
          const isOwn = message.senderId === user?.id;
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {!isOwn && (
                  <p className="text-xs font-medium mb-1 opacity-70">
                    {message.senderName}
                  </p>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? "text-green-200" : "text-gray-400"}`}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Message content"
        />
        <button
          type="submit"
          disabled={sendMessage.isPending || !content.trim()}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
