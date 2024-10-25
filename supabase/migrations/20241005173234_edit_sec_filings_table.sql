ALTER TABLE public.sec_filings
  ADD COLUMN quarter text,
  ADD COLUMN year INT,
  ADD COLUMN period_of_report_date timestamptz,
  ADD COLUMN filed_as_of_date timestamptz,
  ADD COLUMN date_as_of_change timestamptz,
  DROP COLUMN filing_date;

ALTER TABLE public.sec_filings
  ADD CONSTRAINT unique_accession_number UNIQUE (accession_number);

