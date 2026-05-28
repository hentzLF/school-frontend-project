"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useConversations,
  useCreateConversation,
} from "@/hooks/useConversations";
import { useTranslation } from "@/hooks/useTranslation";
import { api } from "@/lib/api";
import { CONVERSATION_ROUTES } from "@/config/constants";
import type { Conversation } from "@/types/conversation";

type StartConversationButtonProps = {
  otherProfileId: string;
  label: string;
  bookingId?: string;
};

export function StartConversationButton({
  otherProfileId,
  label,
  bookingId,
}: StartConversationButtonProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { data: conversations } = useConversations();
  const createConversation = useCreateConversation();

  const existing = Array.isArray(conversations)
    ? conversations.find(
        (c: Conversation) => c.otherParticipant?.profileId === otherProfileId,
      )
    : undefined;

  const handleClick = () => {
    if (existing) {
      router.push(`/messages/${existing.id}`);
    } else {
      setOpen(true);
    }
  };

  const handleCreate = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setIsSending(true);
    createConversation.mutate(
      { participantProfileId: otherProfileId, bookingId },
      {
        onSuccess: async (conversation: Conversation) => {
          try {
            await api(CONVERSATION_ROUTES.messages(conversation.id), {
              method: "POST",
              body: { content: trimmed },
            });
          } catch {
            // Navigate even if message send fails — user can retry in thread
          }
          setOpen(false);
          setMessage("");
          setIsSending(false);
          router.push(`/messages/${conversation.id}`);
        },
        onError: () => {
          setIsSending(false);
        },
      },
    );
  };

  return (
    <>
      <Button variant="outline" onClick={handleClick}>
        <MessageSquare className="mr-2 size-4" aria-hidden="true" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("messages.startConversationTitle")}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("messages.initialMessagePlaceholder")}
            rows={4}
            aria-label={t("messages.messageContent")}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t("common.cancel")}
            </DialogClose>
            <Button
              onClick={handleCreate}
              disabled={!message.trim() || isSending}
            >
              {t("messages.send")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
