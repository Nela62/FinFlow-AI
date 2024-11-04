CREATE TABLE IF NOT EXISTS widget_groups(
  id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  panel_id uuid NOT NULL REFERENCES panels(id),
  ticker_id uuid NOT NULL REFERENCES tickers(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE widget_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "public"."widget_groups" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE widgets
  ADD COLUMN group_id uuid NOT NULL REFERENCES widget_groups(id);

ALTER TABLE panels
  ADD CONSTRAINT panels_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE widgets
  ADD CONSTRAINT widgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE tickers
  ADD COLUMN display_name text GENERATED ALWAYS AS (symbol || ' - ' || name) STORED;

ALTER TABLE panels
  ALTER COLUMN url SET NOT NULL;

CREATE TABLE IF NOT EXISTS personalized_agent_sessions(
  session_id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  agent_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  memory jsonb NOT NULL,
  agent_data jsonb NOT NULL,
  user_data jsonb,
  session_data jsonb NOT NULL,
  created_at int8,
  updated_at int8
);

CREATE TABLE IF NOT EXISTS agent_memory(
  id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  memory jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE personalized_agent_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "personalized_agent_sessions" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "agent_memory" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

