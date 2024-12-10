import React from "react";
import { useDnD } from "./dnd-context";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { TOP_BAR_HEIGHT } from "@/lib/const";

const nodesList = [
  { id: "sec-filing", name: "SEC Filing Parser", disabled: false },
  { id: "api-connector", name: "API Connector", disabled: false },
  { id: "summarizer", name: "Summarizer", disabled: false },
  { id: "switch", name: "Switch", disabled: true },
  { id: "dcf-model", name: "DCF Model", disabled: true },
  { id: "financial-analysis", name: "Financial Analysis", disabled: true },
  { id: "appender", name: "Appender", disabled: false },
  { id: "document-compiler", name: "Document Compiler", disabled: true },
  { id: "email-sender", name: "Email Sender", disabled: false },
  { id: "stock-screener", name: "Stock Screener", disabled: false },
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
    <aside className="flex flex-col gap-4 rounded-tl-[5px] border-r border-slate-300 backdrop-blur-md bg-background/80 shadow-sm w-fit pointer-events-auto">
      <div
        className="text-lg font-semibold border-b border-slate-300 flex items-center px-4"
        style={{ height: TOP_BAR_HEIGHT }}
      >
        <p className="">Node Library</p>
      </div>
      <div className="flex flex-col gap-4 px-4">
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
      </div>
    </aside>
  );
};
