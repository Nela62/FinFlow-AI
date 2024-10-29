create extension if not exists "pg_jsonschema" with schema "extensions";


create extension if not exists "vector" with schema "public" version '0.7.4';


create schema if not exists "vecs";

create table "vecs"."sec-filings" (
    "id" character varying not null,
    "vec" vector(1024) not null,
    "metadata" jsonb not null default '{}'::jsonb
);


CREATE INDEX ix_vector_cosine_ops_hnsw_m16_efc64_88c6b16 ON vecs."sec-filings" USING hnsw (vec vector_cosine_ops) WITH (m='16', ef_construction='64');

CREATE UNIQUE INDEX "sec-filings_pkey" ON vecs."sec-filings" USING btree (id);

alter table "vecs"."sec-filings" add constraint "sec-filings_pkey" PRIMARY KEY using index "sec-filings_pkey";


