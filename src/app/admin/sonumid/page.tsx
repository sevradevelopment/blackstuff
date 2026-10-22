import { MessagesAdmin } from "@/components/admin/MessagesAdmin";
import { getContactMessages } from "@/lib/db";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  return <MessagesAdmin messages={messages} />;
}