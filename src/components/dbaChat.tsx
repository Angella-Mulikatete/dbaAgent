'use client'

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { LoadingDots } from "./LoadingDots";
import { Database, Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const DBAChat = () => {
  // This component provides a chat interface for interacting with a PostgreSQL DBA agent.
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your PostgreSQL database administrator assistant. Ask me anything about PostgreSQL databases, schemas, indexes, or extensions.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending request to DBA agent:", input);
      
      const response = await fetch("/api/ai-db-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("DBA agent response:", result);

      let assistantMessage: Message;
      
      if (result === 'completed') {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: "Your query has been processed successfully! The DBA agent has completed the analysis.",
          isUser: false,
          timestamp: new Date(),
        };
      } else if (result === 'failed') {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, but there was an issue processing your query. Please try rephrasing your question or check if it's related to PostgreSQL databases.",
          isUser: false,
          timestamp: new Date(),
        };
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: `Query status: ${result}. Please check your Inngest dashboard for more details.`,
          isUser: false,
          timestamp: new Date(),
        };
      }

      setMessages((prev) => [...prev, assistantMessage]);

      if (result === 'completed') {
        toast("Query Processed", {
          description: "Your PostgreSQL question has been successfully analyzed.",
        });
      } else if (result === 'failed') {
        toast("Processing Failed", {
          description: "There was an issue processing your query. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error calling DBA agent:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, there was an error processing your request. Please make sure your Inngest service is running and try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      toast("Connection Error", {
        description: "Failed to connect to the DBA agent. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Database className="w-6 h-6" />
          PostgreSQL Database Administrator
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-muted rounded-lg px-4 py-3 shadow-sm">
                <LoadingDots />
              </div>
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about PostgreSQL databases, schemas, indexes..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
