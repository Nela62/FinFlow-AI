import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkflowPageComponent } from "./workflow-page";

export default async function WorkflowPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) return redirect("/login");

  return <WorkflowPageComponent workflowId={params.id} userId={userId} />;
}
