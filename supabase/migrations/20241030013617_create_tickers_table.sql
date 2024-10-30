CREATE TABLE IF NOT EXISTS tickers(
  id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  symbol text NOT NULL,
  name text NOT NULL,
  exchange text NOT NULL,
  assetType text NOT NULL,
  ipoDate timestamptz,
  delistingDate timestamptz,
  status text NOT NULL
);

ALTER TABLE public.tickers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable SELECT for authenticated users" ON "public"."tickers"
  FOR SELECT TO "authenticated"
    USING (TRUE);

ALTER TABLE public.panels ENABLE ROW LEVEL SECURITY;

