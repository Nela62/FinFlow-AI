import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllExecutionsByWorkflowId } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useNodesStore } from "@/providers/nodesProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import React from "react";

// TODO: overflows
// TODO: add realtime updates for workflow runs status

export const RunsList = ({ workflowId }: { workflowId: string }) => {
  const supabase = createClient();
  const {
    data: runs,
    isLoading,
    isError,
  } = useQuery(fetchAllExecutionsByWorkflowId(supabase, workflowId));
  const { setSelectedRunId } = useNodesStore((state) => state);

  if (isError) return <div>Error fetching runs</div>;
  if (isLoading || !runs) return <Skeleton className="h-10 w-full" />;

  return (
    <div className="pl-2 pt-4 flex flex-col gap-2 h-full">
      <p className="text-lg font-semibold pl-2">Runs</p>
      <ScrollArea className="flex-1 pr-2">
        {runs.length > 0 ? (
          runs
            .sort(
              (a, b) =>
                new Date(b.started_at).getTime() -
                new Date(a.started_at).getTime()
            )
            .map((run, i) => (
              <React.Fragment key={run.id}>
                <div
                  className={
                    "cursor-pointer hover:bg-muted p-2 rounded-sm justify-between items-center flex"
                  }
                  onClick={() => setSelectedRunId(run.id)}
                >
                  <div className="">
                    <p>{run.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(run.started_at).toLocaleString()}
                    </p>
                  </div>

                  <p
                    className={cn(
                      "text-xs text-muted-foreground capitalize",
                      run.status === "COMPLETE" && "text-green-600",
                      run.status === "FAILED" && "text-red-600",
                      run.status === "STARTED" && "text-yellow-600",
                      run.status === "PENDING" && "text-gray-600"
                    )}
                  >
                    {run.status.toLowerCase()}
                  </p>
                </div>
                {i !== runs.length - 1 && (
                  <Separator orientation="horizontal" />
                )}
              </React.Fragment>
            ))
        ) : (
          <p className="text-sm text-muted-foreground pl-2">
            No executions yet. Click the run button to get started.
          </p>
        )}
      </ScrollArea>
    </div>
  );
};
