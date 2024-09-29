"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatInputBoxProps {
  handleSend: (message: string) => void;
}

export function ChatInputBox({ handleSend }: ChatInputBoxProps) {
  const [value, setValue] = useState("");

  const onSend = () => {
    if (value.trim()) {
      handleSend(value);
      setValue("");
    }
  };

  return (
    <div className="relative w-full">
      <Input
        className="w-full pr-10 py-6 focus-visible:ring-offset-0 focus-visible:ring-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
        placeholder="Type your message..."
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <Button
          onClick={onSend}
          size="icon"
          disabled={!value.trim()}
          variant="ghost"
        >
          <ArrowRightCircleIcon
            className={cn(
              "h-6 w-6 cursor-pointer",
              value.trim() ? "text-foreground/80" : "text-foreground/50"
            )}
          />
        </Button>
      </div>
    </div>
  );
}
