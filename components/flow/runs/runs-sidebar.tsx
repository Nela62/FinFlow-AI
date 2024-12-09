import { useNodesStore } from "@/providers/nodesProvider";
import { cn } from "@/lib/utils";
import { RunsList } from "./runs-list";
import { RunItem } from "./run-item";

export const RunsSidebar = ({ workflowId }: { workflowId: string }) => {
  const { selectedRunId } = useNodesStore((state) => state);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 h-full border-l backdrop-blur-md bg-background/80 shadow-sm pointer-events-auto",
        selectedRunId ? "w-[500px]" : "w-[300px]"
      )}
    >
      {selectedRunId ? <RunItem /> : <RunsList workflowId={workflowId} />}
    </div>
  );
};
