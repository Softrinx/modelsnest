-- Migrate api_tokens.id from integer to UUID (safe + idempotent)
-- Safe to run multiple times.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'api_tokens'
      AND column_name = 'id'
      AND data_type IN ('smallint', 'integer', 'bigint')
  ) THEN
    ALTER TABLE public.api_tokens
      ADD COLUMN IF NOT EXISTS id_uuid UUID;

    ALTER TABLE public.api_tokens
      ALTER COLUMN id_uuid SET DEFAULT gen_random_uuid();

    UPDATE public.api_tokens
    SET id_uuid = gen_random_uuid()
    WHERE id_uuid IS NULL;

    ALTER TABLE public.api_tokens
      ALTER COLUMN id_uuid SET NOT NULL;

    ALTER TABLE public.api_tokens
      DROP CONSTRAINT IF EXISTS api_tokens_pkey;

    ALTER TABLE public.api_tokens
      DROP COLUMN IF EXISTS id;

    ALTER TABLE public.api_tokens
      RENAME COLUMN id_uuid TO id;

    ALTER TABLE public.api_tokens
      ADD CONSTRAINT api_tokens_pkey PRIMARY KEY (id);
  END IF;
END;
$$;