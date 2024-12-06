import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useReactFlow } from "@xyflow/react";
import { Copy, PenLine, Trash2 } from "lucide-react";

export const NodeMenu = ({ nodeId }: { nodeId: string }) => {
  const { deleteElements, getEdges } = useReactFlow();
  const supabase = createClient();

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
          onClick={async () => {
            if (nodeId) {
              const edges = getEdges();
              const edgesToDelete = edges.filter(
                (edge) => edge.source === nodeId || edge.target === nodeId
              );
              deleteElements({ edges: edgesToDelete });
              await Promise.all(
                edgesToDelete.map((edge) =>
                  supabase.from("edges").delete().eq("id", edge.id)
                )
              );
              deleteElements({ nodes: [{ id: nodeId }] });
              await supabase.from("nodes").delete().eq("id", nodeId);
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
