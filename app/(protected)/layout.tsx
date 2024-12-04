import { createClient } from "@/lib/supabase/server";
import { LayoutComponent } from "./layout-component";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <LayoutComponent userId={user.id}>{children}</LayoutComponent>;
}
