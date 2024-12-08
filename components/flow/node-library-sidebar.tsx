import React from "react";
import { useDnD } from "./dnd-context";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

const nodesList = [
  { id: "sec-filing", name: "SEC Filing Parser", disabled: false },
  { id: "api-connector", name: "API Connector", disabled: true },
  { id: "summarizer", name: "Summarizer", disabled: false },
  { id: "switch", name: "Switch", disabled: true },
  { id: "dcf-model", name: "DCF Model", disabled: true },
  { id: "financial-analysis", name: "Financial Analysis", disabled: true },
  { id: "appender", name: "Appender", disabled: true },
  { id: "document-compiler", name: "Document Compiler", disabled: true },
  { id: "email-sender", name: "Email Sender", disabled: false },
];

export const NodeLibrarySidebar = () => {
  const [_, setType] = useDnD();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    // @ts-ignore
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex flex-col gap-4 rounded-tl-xl absolute top-0 left-0 bottom-0 border-r backdrop-blur-md bg-background/40 p-4 shadow-sm w-[300px]">
      <div className="text-lg font-semibold">Node Library</div>
      {nodesList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((node) => (
          <Card
            className={cn(
              "w-fit cursor-grab bg-muted",
              node.disabled && "opacity-50 cursor-not-allowed"
            )}
            onDragStart={(event) => onDragStart(event, node.id)}
            draggable={!node.disabled}
            key={node.id}
          >
            <CardContent className="select-none px-3 py-1 text-sm">
              {node.name}
            </CardContent>
          </Card>
        ))}
    </aside>
  );
};
