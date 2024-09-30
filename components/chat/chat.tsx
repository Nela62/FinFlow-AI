"use client";

import { useChat } from "ai/react";
import { ChatInputBox } from "./chat-input-box";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    keepLastMessageOnError: true,
  });

  return (
    <>
      <ScrollArea className="h-96 pr-4 w-full">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "w-full flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  message.role === "user"
                    ? "bg-accent p-4"
                    : "bg-background py-4 pr-4",
                  "w-fit max-w-2xl rounded-lg"
                )}
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  className={cn(
                    message.role === "user" ? "" : "[&>p]:mb-4",
                    ""
                  )}
                >
                  {message.content}
                </Markdown>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <ChatInputBox
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
