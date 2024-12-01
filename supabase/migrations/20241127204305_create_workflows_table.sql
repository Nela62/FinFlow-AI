CREATE TABLE IF NOT EXISTS workflows(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "workflows" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

CREATE TABLE IF NOT EXISTS executions(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name text NOT NULL,
  status text NOT NULL,
  started_at timestamp with time zone DEFAULT now() NOT NULL,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "executions" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

CREATE TABLE IF NOT EXISTS tasks(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  execution_id uuid NOT NULL REFERENCES executions(id) ON DELETE CASCADE ON UPDATE CASCADE,
  action_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name text NOT NULL,
  status text NOT NULL,
  input_values jsonb NOT NULL,
  output_values jsonb NOT NULL,
  started_at timestamp with time zone DEFAULT now() NOT NULL,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS subtasks(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  execution_id uuid NOT NULL REFERENCES executions(id) ON DELETE CASCADE ON UPDATE CASCADE,
  action_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name text NOT NULL,
  status text NOT NULL,
  started_at timestamp with time zone DEFAULT now() NOT NULL,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "subtasks" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "tasks" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

CREATE TABLE IF NOT EXISTS nodes(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  position jsonb NOT NULL,
  data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "nodes" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

CREATE TABLE IF NOT EXISTS edges(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE ON UPDATE CASCADE,
  source uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  target uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  source_handle text NOT NULL,
  target_handle text NOT NULL,
  type text NOT NULL,
  animated boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL to authenticated users based on user id" ON "edges" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

CREATE SEQUENCE task_id_sequence;

CREATE TABLE IF NOT EXISTS celery_taskmeta(
  id serial NOT NULL PRIMARY KEY,
  task_id varchar(155) UNIQUE NOT NULL,
  status varchar(50) NOT NULL,
  result text,
  date_done timestamp with time zone,
  traceback text,
  name varchar(155),
  args text,
  kwargs text,
  worker varchar(155),
  retries integer,
  queue varchar(155)
);

CREATE TABLE IF NOT EXISTS celery_tasksetmeta(
  id serial NOT NULL PRIMARY KEY,
  taskset_id varchar(155) UNIQUE NOT NULL,
  result text NOT NULL,
  date_done timestamp with time zone NOT NULL
);

