import { createClient } from "@/lib/supabase/server";
import { NewPanelComponent } from "./new-panel";
import { redirect } from "next/navigation";

export default async function NewPanelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <NewPanelComponent userId={user.id} />;
}
