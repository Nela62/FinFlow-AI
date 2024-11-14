import { Button } from "@/components/ui/button";
import { useNodesStore } from "@/providers/nodesProvider";
import { Copy, PenLine, Trash2 } from "lucide-react";

export const Menu = ({ nodeId }: { nodeId: string }) => {
  const { deleteNode } = useNodesStore((state) => state);

  return (
    <div className="hidden group-hover:block absolute right-0 top-0 translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-background rounded-md shadow-md border p-1 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            // TODO: Implement rename
          }}
        >
          <PenLine className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            // TODO: Implement duplicate
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            deleteNode(nodeId);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
