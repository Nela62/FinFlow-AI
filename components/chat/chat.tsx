"use client";

import { v4 as uuidv4 } from "uuid";

import { ChatInputBox } from "./chat-input-box";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { Message } from "@/types/message";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!input.trim()) return;

      const userMessage = {
        id: uuidv4(),
        role: "user",
        content: input,
      } as Message;
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: [...messages, userMessage] }),
          }
        );

        if (!response.ok || !response.body)
          throw new Error("Network response was not ok");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let assistantMessage = {
          id: uuidv4(),
          role: "assistant",
          content: "",
        } as Message;
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              if (data.delta) {
                assistantMessage.content += data.delta;
                setMessages((prevMessages) => [
                  ...prevMessages.slice(0, -1),
                  { ...assistantMessage },
                ]);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [input, messages]
  );

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
