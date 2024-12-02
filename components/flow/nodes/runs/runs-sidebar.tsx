import { useNodesStore } from "@/providers/nodesProvider";
import { cn } from "@/lib/utils";
import { RunsList } from "./runs-list";
import { RunItem } from "./run-item";

export const RunsSidebar = ({ workflowId }: { workflowId: string }) => {
  const { selectedRunId } = useNodesStore((state) => state);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 h-full absolute top-4 bottom-0 right-4 border rounded-md backdrop-blur-md bg-background/40 shadow-sm p-4",
        selectedRunId ? "w-[500px]" : "w-[250px]"
      )}
    >
      {selectedRunId ? <RunItem /> : <RunsList workflowId={workflowId} />}
    </div>
  );
};
