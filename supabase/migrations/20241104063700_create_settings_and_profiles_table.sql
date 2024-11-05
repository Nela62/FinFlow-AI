CREATE TABLE IF NOT EXISTS public.settings(
  id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  email text,
  plan text NOT NULL DEFAULT 'free',
  credit_limit int NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workspaces(
  id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL for authenticated users based on user_id" ON "public"."settings" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL for authenticated users based on user_id" ON "public"."workspaces" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE public.panels
  ADD COLUMN workspace_id uuid NOT NULL REFERENCES public.workspaces(id);

CREATE TABLE IF NOT EXISTS public.chat_history(
  id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  workspace_id uuid NOT NULL REFERENCES workspaces(id),
  summary text NOT NULL,
  messages jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "chat_history" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

