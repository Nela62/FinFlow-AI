"use client";

import { Flow } from "@/components/flow/flow";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWorkflowById } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const WorkflowPageComponent = ({
  workflowId,
  userId,
}: {
  workflowId: string;
  userId: string;
}) => {
  const supabase = createClient();
  const { data: workflow } = useQuery(fetchWorkflowById(supabase, workflowId));

  if (!workflow) return <Skeleton className="w-full h-10" />;

  return (
    <div className="h-[calc(100vh-62px)] w-[calc(100vw-70px)]">
      <Flow workflowId={workflowId} userId={userId} />
    </div>
  );
};
