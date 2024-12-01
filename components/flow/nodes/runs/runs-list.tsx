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

  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (isError) return <div>Error fetching runs</div>;

  return <div>{runs?.length}</div>;
};
