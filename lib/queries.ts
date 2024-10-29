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

export function fetchPanelByUrl(client: TypedSupabaseClient, url: string) {
  return client
    .from("panels")
    .select("id, name, url")
    .eq("url", url)
    .maybeSingle()
    .throwOnError();
}

export function fetchAllWidgets(client: TypedSupabaseClient, panelId: string) {
  return client
    .from("widgets")
    .select("id, panels (id, url), type, last_updated, data, config, position")
    .eq("panels.url", panelId)
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
