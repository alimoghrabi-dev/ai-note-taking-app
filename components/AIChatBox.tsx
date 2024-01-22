import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, Loader2, Trash, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef, useState } from "react";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const AIChatBox = ({ open, onClose }: AIChatBoxProps) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  const [numDots, setNumDots] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (numDots < 5) {
        setNumDots((prev) => prev + 1);
      } else {
        setNumDots((prev) => prev - 4);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [numDots]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full p-2 sm:max-w-[500px] xl:right-12",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block rounded-full">
        <XCircle size={30} />
      </button>
      <div className="flex h-[400px] flex-col rounded border border-slate-300 bg-background shadow-sm shadow-gray-900/40 dark:border-slate-900">
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                //@ts-ignore
                content: [...Array(numDots)].map((_, index) => "."),
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Something went wrong. Please try again.",
              }}
            />
          )}

          {!error && !messages.length && (
            <div className="flex h-full items-center justify-center gap-3 text-lg">
              <Bot />
              Ask AI about your notes
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-x-1.5">
          <Button
            title="Clear Chat"
            variant={"outline"}
            size={"icon"}
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash />
          </Button>
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            className="border-slate-300 outline-none transition-all focus-visible:border-primary focus-visible:ring-0"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIChatBox;
