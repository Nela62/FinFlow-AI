import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllExecutionsByWorkflowId } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const RunsList = ({ workflowId }: { workflowId: string }) => {
  const supabase = createClient();
  const {
    data: runs,
    isLoading,
    isError,
  } = useQuery(fetchAllExecutionsByWorkflowId(supabase, workflowId));

  if (isError) return <div>Error fetching runs</div>;
  if (isLoading || !runs) return <Skeleton className="h-10 w-full" />;

  return (
    <div>
      <p className="text-lg font-semibold">Runs</p>
      {runs.length > 0 ? (
        runs.map((run) => <p key={run.id}>{run.name}</p>)
      ) : (
        <p className="text-sm text-muted-foreground">
          No executions yet. Click the run button to get started.
        </p>
      )}
    </div>
  );
};
