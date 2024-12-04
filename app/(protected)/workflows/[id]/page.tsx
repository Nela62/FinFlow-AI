import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkflowPageComponent } from "./workflow-page";

export default async function WorkflowPage({
  params,
}: {
  params: { id: string };
}) {
  const {id} = await params;
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) return redirect("/login");

  return <WorkflowPageComponent workflowId={id} userId={userId} />;
}
