import React from "react";
import { useDnD } from "./dnd-context";
import { Card, CardContent } from "../ui/card";

export default () => {
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
    <aside className="flex flex-col gap-4 w-fit absolute top-4 right-4 border rounded-sm bg-background p-4">
      <div className="">You can drag these nodes to the pane on the right.</div>
      <Card
        className="w-fit cursor-grab bg-muted"
        onDragStart={(event) => onDragStart(event, "sec-filing")}
        draggable
      >
        <CardContent className="select-none px-3 py-2">SEC Filing</CardContent>
      </Card>
      <Card
        className="w-fit cursor-grab bg-muted"
        onDragStart={(event) => onDragStart(event, "api-endpoint")}
        draggable
      >
        <CardContent className="select-none px-3 py-2">
          API Endpoint
        </CardContent>
      </Card>
      <Card
        className="w-fit cursor-grab bg-muted"
        onDragStart={(event) => onDragStart(event, "dcf")}
        draggable
      >
        <CardContent className="select-none px-3 py-2">DCF</CardContent>
      </Card>
    </aside>
  );
};
