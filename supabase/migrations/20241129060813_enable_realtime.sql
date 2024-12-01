-- Enable realtime only for tasks and subtasks tables
ALTER PUBLICATION supabase_realtime
  ADD TABLE public.tasks;

ALTER PUBLICATION supabase_realtime
  ADD TABLE public.subtasks;

-- Enable replica identity for these specific tables
ALTER TABLE public.tasks REPLICA IDENTITY
  FULL;

ALTER TABLE public.subtasks REPLICA IDENTITY
  FULL;

