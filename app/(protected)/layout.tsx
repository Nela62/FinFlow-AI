import { createClient } from "@/lib/supabase/server";
import { LayoutComponent } from "./layout-component";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <LayoutComponent userId={user.id}>{children}</LayoutComponent>;
}
