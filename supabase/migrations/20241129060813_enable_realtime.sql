-- Enable realtime only for actions and subactions tables
ALTER PUBLICATION supabase_realtime
  ADD TABLE public.actions;

ALTER PUBLICATION supabase_realtime
  ADD TABLE public.subactions;

-- Enable replica identity for these specific tables
ALTER TABLE public.actions REPLICA IDENTITY
  FULL;

ALTER TABLE public.subactions REPLICA IDENTITY
  FULL;

