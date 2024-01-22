import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Message } from "ai";
import { Bot } from "lucide-react";
import Image from "next/image";

const ChatMessage = ({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) => {
  const { user } = useUser();

  const isAIMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAIMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAIMessage && <Bot className="mr-2 shrink-0" />}

      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-1.5",
          isAIMessage ? "bg-gray-200" : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>
      {!isAIMessage && user?.imageUrl && (
        <Image
          src={user?.imageUrl}
          alt="user avatar"
          width={40}
          height={40}
          className="ml-2 rounded-full"
        />
      )}
    </div>
  );
};

export default ChatMessage;
