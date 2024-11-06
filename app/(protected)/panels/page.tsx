import { fetchAllPanels } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { useSidebarStore } from "@/providers/sidebarStoreProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default async function Panels() {
  const supabase = createClient();
  const { workspaceId } = useSidebarStore((state) => state);

  const { data: panels } = useQuery(
    fetchAllPanels(supabase, workspaceId ?? ""),
    { enabled: !!workspaceId }
  );

  return <div>{JSON.stringify(panels)}</div>;
}
