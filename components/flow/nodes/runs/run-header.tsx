import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchExecutionById } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useNodesStore } from "@/providers/nodesProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { ArrowLeftIcon } from "lucide-react";

// TODO: Improve the design of this component: add completion time

export const RunHeader = () => {
  const { selectedRunId, resetSelectedRunId } = useNodesStore((state) => state);

  const supabase = createClient();
  const { data: run } = useQuery(
    fetchExecutionById(supabase, selectedRunId ?? ""),
    { enabled: !!selectedRunId }
  );

  return run ? (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button
          onClick={resetSelectedRunId}
          size="icon"
          variant="ghost"
          className="h-8 w-8"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <p>{run.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          {run.status === "COMPLETED" ? "Completed" : "Running"}
        </p>
      </div>
    </div>
  ) : (
    <Skeleton className="h-10 w-full" />
  );
};
