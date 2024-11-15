import React, { useState } from "react";
import { useDnD } from "./dnd-context";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useNodesStore } from "@/providers/nodesProvider";

const nodesList = [
  { id: "sec-filing", name: "SEC Filing Parser" },
  { id: "api-connector", name: "API Connector" },
  { id: "summarizer", name: "Summarizer" },
  { id: "switch", name: "Switch" },
  { id: "dcf-model", name: "DCF Model" },
  { id: "financial-analysis", name: "Financial Analysis" },
  { id: "appender", name: "Appender" },
  { id: "document-compiler", name: "Document Compiler" },
  { id: "email-sender", name: "Email Sender" },
];

export default () => {
  const [_, setType] = useDnD();
  const { nodes, addRunResult } = useNodesStore((state) => state);
  const [isRunning, setIsRunning] = useState(false);

  const run = async () => {
    setIsRunning(true);
    const order = ["a", "b", "d", "e", "i", "f", "g"];
    for (const nodeId of order) {
      console.log("running ", nodeId);
      const node = nodes.find((node) => node.id === nodeId);
      // @ts-ignore
      const result = await node?.data.runFn(node.data.params);
      addRunResult({ ...result, id: nodeId });
    }
    setIsRunning(false);
  };

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    // @ts-ignore
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex flex-col gap-4 w-fit absolute top-4 left-4 border rounded-sm bg-background p-4 shadow-sm">
      <div className="text-lg font-semibold">Node Library</div>
      {nodesList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((node) => (
          <Card
            className="w-fit cursor-grab bg-muted"
            onDragStart={(event) => onDragStart(event, node.id)}
            draggable
            key={node.id}
          >
            <CardContent className="select-none px-3 py-1 text-sm">
              {node.name}
            </CardContent>
          </Card>
        ))}
      <Button onClick={run} disabled={isRunning}>
        {isRunning ? "Running..." : "Run"}
      </Button>
    </aside>
  );
};
