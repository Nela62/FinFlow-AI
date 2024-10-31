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

export function fetchAllWidgetGroups(client: TypedSupabaseClient, url: string) {
  return client
    .from("widget_groups")
    .select(
      "id, name, tickers (id, name, symbol, exchange, asset_type), panels (url)"
    )
    .eq("panels.url", url)
    .throwOnError();
}

export function fetchAllWidgets(client: TypedSupabaseClient, panelId: string) {
  return client
    .from("widgets")
    .select(
      "id, panels (id, url), widget_groups (id, name, tickers(id, name, symbol, exchange, asset_type)),type, last_updated, data, config, position"
    )
    .eq("panels.url", panelId)
    .throwOnError();
}

export function fetchWidgetById(client: TypedSupabaseClient, id: string) {
  return client
    .from("widgets")
    .select(
      "id, user_id, widget_groups (id, name, tickers(id,name, symbol, exchange, asset_type)), data, config, last_updated"
    )
    .eq("id", id)
    .maybeSingle()
    .throwOnError();
}
