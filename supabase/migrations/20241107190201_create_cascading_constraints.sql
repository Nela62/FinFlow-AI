ALTER TABLE chat_history
  DROP CONSTRAINT chat_history_user_id_fkey;

ALTER TABLE chat_history
  DROP CONSTRAINT chat_history_workspace_id_fkey;

ALTER TABLE panels
  DROP CONSTRAINT panels_user_id_fkey;

ALTER TABLE panels
  DROP CONSTRAINT panels_workspace_id_fkey;

ALTER TABLE settings
  DROP CONSTRAINT settings_user_id_fkey;

ALTER TABLE widget_groups
  DROP CONSTRAINT widget_groups_user_id_fkey;

ALTER TABLE widget_groups
  DROP CONSTRAINT widget_groups_panel_id_fkey;

ALTER TABLE widget_groups
  DROP CONSTRAINT widget_groups_ticker_id_fkey;

ALTER TABLE widgets
  DROP CONSTRAINT widgets_user_id_fkey;

ALTER TABLE widgets
  DROP CONSTRAINT widgets_group_id_fkey;

ALTER TABLE widgets
  DROP CONSTRAINT widgets_panel_id_fkey;

ALTER TABLE workspaces
  DROP CONSTRAINT workspaces_user_id_fkey;

ALTER TABLE chat_history
  ADD CONSTRAINT chat_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE chat_history
  ADD CONSTRAINT chat_history_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

ALTER TABLE panels
  ADD CONSTRAINT panels_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE panels
  ADD CONSTRAINT panels_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

ALTER TABLE settings
  ADD CONSTRAINT settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE widget_groups
  ADD CONSTRAINT widget_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE widget_groups
  ADD CONSTRAINT widget_groups_panel_id_fkey FOREIGN KEY (panel_id) REFERENCES panels(id) ON DELETE CASCADE;

ALTER TABLE widget_groups
  ADD CONSTRAINT widget_groups_ticker_id_fkey FOREIGN KEY (ticker_id) REFERENCES tickers(id) ON DELETE SET NULL;

ALTER TABLE widgets
  ADD CONSTRAINT widgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE widgets
  ADD CONSTRAINT widgets_panel_id_fkey FOREIGN KEY (panel_id) REFERENCES panels(id) ON DELETE CASCADE;

ALTER TABLE widgets
  ADD CONSTRAINT widgets_group_id_fkey FOREIGN KEY (group_id) REFERENCES widget_groups(id) ON DELETE CASCADE;

ALTER TABLE workspaces
  ADD CONSTRAINT workspaces_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

