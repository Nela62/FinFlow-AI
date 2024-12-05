import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchExecutionById } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useNodesStore } from "@/providers/nodesProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { ArrowLeftIcon } from "lucide-react";

// TODO: Improve the design of this component: add completion time

export const RunHeader = () => {
  const { selectedRunId, resetSelectedRunId, isRunning } = useNodesStore(
    (state) => state
  );

  const supabase = createClient();
  const { data: run } = useQuery(
    fetchExecutionById(supabase, selectedRunId ?? ""),
    { enabled: !!selectedRunId }
  );

  return (
    <>
      {run ? (
        <div className="flex justify-between items-center px-4 py-2">
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
            <p
              className={cn(
                "text-xs text-muted-foreground capitalize",
                isRunning && "text-yellow-600",
                !isRunning && "text-green-600"
                // run.status === "COMPLETED" && "text-green-600",
                // run.status === "FAILED" && "text-red-600",
                // run.status === "STARTED" && "text-yellow-600",
                // run.status === "PENDING" && "text-gray-600"
              )}
            >
              {/* {run.status.toLowerCase()} */}
              {isRunning ? "Started" : "Completed"}
            </p>
          </div>
        </div>
      ) : (
        <Skeleton className="h-10 w-full" />
      )}
      <Separator orientation="horizontal" />
    </>
  );
};
