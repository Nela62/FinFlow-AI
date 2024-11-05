"use client";

import { v4 as uuidv4 } from "uuid";

import { ChatInputBox } from "./chat-input-box";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Fragment, useCallback, useState } from "react";
import { Message } from "@/types/message";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown, MessageCirclePlus } from "lucide-react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAIChats } from "@/lib/queries";
import { Separator } from "../ui/separator";
import { format } from "date-fns";

// TODO: Separate them into different components

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const supabase = createClient();

  const { data: chats } = useQuery(fetchAIChats(supabase));

  console.log(chats);

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
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) throw new Error("No session found");

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ message: input, session_id: sessionId }),
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
              } else if (data.session_id && data.session_id !== sessionId) {
                setSessionId(data.session_id);
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
    <div className="flex flex-col h-full pr-2">
      <div className="flex gap-2 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-8 flex items-center justify-between px-2"
            >
              <p>Chat History</p>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="" align="start">
            {chats?.map((chat, i) => (
              <Fragment key={chat.id}>
                <DropdownMenuItem className="w-full text-sm flex justify-between">
                  <p className="text-sm">
                    {/* @ts-ignore */}
                    {chat?.memory?.runs[0]?.message.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(Number(chat.updated_at) * 1000), "MMM d")}
                  </p>
                </DropdownMenuItem>
                {i !== chats.length - 1 && (
                  <Separator orientation="horizontal" />
                )}
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon" className="h-8">
          <MessageCirclePlus className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  message.role === "user" ? "bg-accent" : "bg-background",
                  "max-w-full rounded-lg px-3 py-2 border"
                )}
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  className={cn(
                    // message.role === "user" ? "" : "[&>p]:mb-4",
                    "text-sm break-words"
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
    </div>
  );
}
