import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const MessageBubble = ({ message, isUser, timestamp }: MessageBubbleProps) => {
  return (
    <div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-3 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message}
        </div>
        <div className="text-xs mt-2 opacity-70">
          {timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};