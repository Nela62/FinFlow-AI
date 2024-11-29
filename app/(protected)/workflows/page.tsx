import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllWorkflows } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export default async function WorkflowsPage() {
  const supabase = createClient();
  const { data: workflows } = await fetchAllWorkflows(supabase);
  const userResponse = await supabase.auth.getUser();

  if (!userResponse.data.user) {
    redirect("/sign-in");
  }

  if (!workflows) return <Skeleton className="w-full h-10" />;
  else if (workflows.length === 0) {
    const workflowNameId = nanoid(10);
    const { data: id } = await supabase
      .from("workflows")
      .insert([
        {
          name: `Workflow ${workflowNameId}`,
          user_id: userResponse.data.user?.id,
        },
      ])
      .select();
    redirect(`/workflows/${id}`);
  } else {
    redirect(`/workflows/${workflows[0].id}`);
  }
}
