import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllWorkflows } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export default async function WorkflowsPage() {
  const supabase = await createClient();
  const { data: workflows } = await fetchAllWorkflows(supabase);

  if (!workflows) return <Skeleton className="w-full h-10" />;
  else if (workflows.length === 0) {
    const workflowNameId = nanoid(10);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/login");
    }

    const { data, error } = await supabase
      .from("workflows")
      .insert({
        name: `Workflow ${workflowNameId}`,
        user_id: user.id,
      })
      .select();
    console.log("data", data);
    console.log("error", error);
    if (data) redirect(`/workflows/${data[0].id}`);
    else return <div>Error creating workflow</div>;
  } else {
    redirect(`/workflows/${workflows[0].id}`);
  }
}
