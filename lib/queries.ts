import { TypedSupabaseClient } from "@/types/supabase";

// WORKSPACES
export function fetchAllWorkspaces(client: TypedSupabaseClient) {
  return client.from("workspaces").select("id, name").throwOnError();
}

// PANELS
export function fetchAllPanels(client: TypedSupabaseClient) {
  return client
    .from("panels")
    .select("id, name, url, workspace_id")
    .throwOnError();
}

export function fetchAllPanelsByWorkspaceId(
  client: TypedSupabaseClient,
  workspaceId: string
) {
  return client
    .from("panels")
    .select("id, name, url, workspace_id")
    .eq("workspace_id", workspaceId)
    .throwOnError();
}

export function fetchPanelById(client: TypedSupabaseClient, id: string) {
  return client
    .from("panels")
    .select("id, name, url, workspace_id")
    .eq("id", id)
    .maybeSingle()
    .throwOnError();
}

export function fetchPanelByUrl(client: TypedSupabaseClient, url: string) {
  return client
    .from("panels")
    .select("id, name, url, workspace_id")
    .eq("url", url)
    .maybeSingle()
    .throwOnError();
}

// FIXME: for some reason join on panels returns null
// WIDGET GROUPS
export function fetchAllWidgetGroups(
  client: TypedSupabaseClient,
  panelId: string
) {
  return client
    .from("widget_groups")
    .select(
      "id, name, tickers (id, name, symbol, exchange, asset_type), panel_id"
    )
    .eq("panel_id", panelId)
    .throwOnError();
}

// WIDGETS
export function fetchAllWidgets(client: TypedSupabaseClient, panelId: string) {
  return client
    .from("widgets")
    .select(
      "id, panel_id, widget_groups (id, name, tickers (id, name, symbol, exchange, asset_type)), type, last_updated, data, config, position"
    )
    .eq("panel_id", panelId)
    .throwOnError();
}

export function fetchWidgetById(client: TypedSupabaseClient, id: string) {
  return client
    .from("widgets")
    .select(
      "id, user_id, widget_groups (id, name, tickers(id, name, symbol, exchange, asset_type)), data, config, last_updated"
    )
    .eq("id", id)
    .maybeSingle()
    .throwOnError();
}

// STOCKS
export function fetchStockByTicker(
  client: TypedSupabaseClient,
  ticker: string
) {
  return client
    .from("tickers")
    .select("id, symbol, name, exchange, asset_type, status")
    .eq("symbol", ticker)
    .maybeSingle()
    .throwOnError();
}

export function fetchStockById(client: TypedSupabaseClient, id: string) {
  return client
    .from("tickers")
    .select("id, symbol, name, exchange, asset_type, status")
    .eq("id", id)
    .maybeSingle()
    .throwOnError();
}

export function fetchAIChats(client: TypedSupabaseClient) {
  return client
    .from("chat_history")
    .select("id, summary, messages, created_at, updated_at")
    .throwOnError();
}

export function fetchSettings(client: TypedSupabaseClient) {
  return client
    .from("settings")
    .select("id, email, plan, credit_limit")
    .maybeSingle()
    .throwOnError();
}

// WORKFLOWS
export function fetchAllWorkflows(client: TypedSupabaseClient) {
  return client
    .from("workflows")
    .select("id, name, created_at, updated_at")
    .throwOnError();
}

export function fetchWorkflowById(client: TypedSupabaseClient, id: string) {
  return client
    .from("workflows")
    .select("id, name, created_at, updated_at")
    .eq("id", id)
    .maybeSingle()
    .throwOnError();
}

export function fetchAllExecutionsByWorkflowId(
  client: TypedSupabaseClient,
  workflowId: string
) {
  return client
    .from("executions")
    .select("id, name, status, started_at, completed_at")
    .eq("workflow_id", workflowId)
    .throwOnError();
}

export function fetchExecutionById(client: TypedSupabaseClient, id: string) {
  return client
    .from("executions")
    .select("id, name, status, started_at, completed_at")
    .eq("id", id)
    .maybeSingle()
    .throwOnError();
}

export function fetchAllTasksByExecutionId(
  client: TypedSupabaseClient,
  executionId: string
) {
  return client
    .from("tasks")
    .select(
      "id, name, status, input_values, output_values, started_at, completed_at"
    )
    .eq("execution_id", executionId)
    .throwOnError();
}

export function fetchAllSubtasksByExecutionId(
  client: TypedSupabaseClient,
  executionId: string
) {
  return client
    .from("subtasks")
    .select("id, name, status, task_id, created_at, updated_at")
    .eq("execution_id", executionId)
    .throwOnError();
}

export function fetchNodesByWorkflowId(
  client: TypedSupabaseClient,
  workflowId: string
) {
  return client
    .from("nodes")
    .select("id, workflow_id, name, type, data, position")
    .eq("workflow_id", workflowId)
    .throwOnError();
}

export function fetchEdgesByWorkflowId(
  client: TypedSupabaseClient,
  workflowId: string
) {
  return client
    .from("edges")
    .select(
      "id, workflow_id, source, target, source_handle, target_handle, type, animated"
    )
    .eq("workflow_id", workflowId)
    .throwOnError();
}
