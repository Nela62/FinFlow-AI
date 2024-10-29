CREATE TABLE IF NOT EXISTS public.panels(
  id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL
);

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "public"."panels" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

CREATE TABLE IF NOT EXISTS public.widgets(
  id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  user_id uuid NOT NULL,
  panel_id uuid NOT NULL REFERENCES panels(id),
  type text NOT NULL,
  last_updated timestamptz NOT NULL DEFAULT now(),
  data jsonb NOT NULL,
  config jsonb NOT NULL
);

ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "public"."widgets" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

