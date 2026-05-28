"use client";

import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ConversationList() {
  const { data: conversations, isLoading, error } = useConversations();
  const { t } = useTranslation();

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (error) return <ErrorState message={t("messages.loadError")} />;

  const conversationList = Array.isArray(conversations) ? conversations : [];

  return (
    <div>
      <PageHeader title={t("messages.title")} />

      {conversationList.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title={t("messages.noConversations")}
          description={t("dashboard.messagesDesc")}
        />
      ) : (
        <div className="space-y-2">
          {conversationList.map((conversation) => {
            const title = conversation.otherParticipant?.fullName ?? conversation.id;
            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all hover:shadow-sm hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {title.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium text-foreground">
                      {title}
                    </p>
                    {conversation.lastMessage?.sentAt && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(
                          conversation.lastMessage.sentAt,
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage?.content && (
                    <p className="truncate text-sm text-muted-foreground">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
