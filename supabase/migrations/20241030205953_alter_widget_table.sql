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

