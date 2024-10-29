import { TypedSupabaseClient } from "@/types/supabase";

export function fetchAllPanels(client: TypedSupabaseClient) {
  return client.from("panels").select("id, name").throwOnError();
}

export function fetchPanelById(client: TypedSupabaseClient, id: string) {
  return client
    .from("panels")
    .select("id, name")
    .eq("id", id)
    .maybeSingle()
    .throwOnError();
}

export function fetchAllWidgets(client: TypedSupabaseClient, panelId: string) {
  return client
    .from("widgets")
    .select("id, data, config")
    .eq("panel_id", panelId)
    .throwOnError();
}

export function fetchWidgetById(client: TypedSupabaseClient, id: string) {
  return client
    .from("widgets")
    .select("id, user_id, data, config, last_updated")
    .eq("id", id)
    .maybeSingle()
    .throwOnError();
}
