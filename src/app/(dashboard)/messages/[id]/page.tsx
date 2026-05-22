import { MessageThread } from "@/components/messages/MessageThread";

type MessagePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MessagePage({ params }: MessagePageProps) {
  const { id } = await params;
  return <MessageThread conversationId={id} />;
}
