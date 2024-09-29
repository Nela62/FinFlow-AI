import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  if (!user) {
    return redirect("/sign-in");
  }

  return <div>Chat</div>;
}
