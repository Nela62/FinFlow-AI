INSERT INTO storage.buckets(id, name, public)
  VALUES ('sec-filings', 'sec-filings', FALSE);

CREATE POLICY "Give authenticated users access to SEC Filings" ON storage.objects
  FOR SELECT TO authenticated
    USING (bucket_id = 'sec-filings');

CREATE TABLE IF NOT EXISTS public.sec_filings(
  id uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
  company_name text,
  ticker text,
  cik text,
  accession_number text,
  filing_type text,
  filing_date timestamptz,
  filing_path text
);

ALTER TABLE public.sec_filings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable SELECT for authenticated users" ON "public"."sec_filings"
  FOR SELECT TO "authenticated"
    USING (TRUE);

