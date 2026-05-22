"use client";

import Link from "next/link";
import { useConversations } from "@/hooks/useConversations";

export function ConversationList() {
  const { data: conversations, isLoading, error } = useConversations();

  if (isLoading)
    return <p className="text-gray-500">Loading conversations...</p>;

  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
      >
        Failed to load conversations.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      {!conversations || conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="block border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">
                  {conversation.participantNames.join(", ")}
                </p>
                {conversation.lastMessageAt && (
                  <span className="text-xs text-gray-400">
                    {new Date(conversation.lastMessageAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {conversation.lastMessage && (
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {conversation.lastMessage}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
