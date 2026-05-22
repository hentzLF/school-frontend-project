"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useMessages, useSendMessage } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MessageThreadProps = {
  conversationId: string;
};

export function MessageThread({ conversationId }: MessageThreadProps) {
  const { user } = useAuth();
  const { data: messages, isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const { t } = useTranslation();
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
    <div className="flex h-[calc(100svh-10rem)] flex-col">
      <Link
        href="/messages"
        className="mb-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("messages.backToConversations")}
      </Link>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        {isLoading && <LoadingState label={t("common.loading")} />}

        {messages?.map((message) => {
          const isOwn = message.senderId === user?.id;
          return (
            <div
              key={message.id}
              className={cn("flex", isOwn ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-xs rounded-2xl px-4 py-2 lg:max-w-md",
                  isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {!isOwn && (
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    {message.senderName}
                  </p>
                )}
                <p className="text-sm break-words">{message.content}</p>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    isOwn
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <Input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("messages.typeMessage")}
          aria-label={t("messages.messageContent")}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={sendMessage.isPending || !content.trim()}
        >
          <Send aria-hidden="true" />
          {t("messages.send")}
        </Button>
      </form>
    </div>
  );
}
