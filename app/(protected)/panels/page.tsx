"use client";

import { fetchAllPanelsByWorkspaceId, fetchAllWorkspaces } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useSidebarStore } from "@/providers/sidebarStoreProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useRouter } from "next/navigation";

export default function Panels() {
  const supabase = createClient();
  const router = useRouter();

  const { workspaceId, setWorkspaceId } = useSidebarStore((state) => state);

  const { data: workspaces } = useQuery(fetchAllWorkspaces(supabase));

  const { data: panels } = useQuery(
    fetchAllPanelsByWorkspaceId(supabase, workspaceId ?? ""),
    { enabled: !!workspaceId }
  );

  if (!workspaceId && workspaces && workspaces.length > 0) {
    setWorkspaceId(workspaces?.[0].id);
  }

  if (panels) {
    if (panels.length > 0) {
      router.push(`/panels/${panels[0].url}`);
    } else {
      router.push("/panels/new");
    }
  }
}
