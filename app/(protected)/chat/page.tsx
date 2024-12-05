import Chat from "@/components/chat/chat";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const handleSend = async (message: string) => {
    "use server";
    console.log(message);
    // Here you can add the logic to send the message to your backend or database
  };

  return (
    <div className="grow max-w-screen-md w-full flex flex-col justify-center">
      <Chat />
    </div>
  );
}
