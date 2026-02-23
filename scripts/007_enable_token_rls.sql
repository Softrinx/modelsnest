-- Enable and enforce row-level security for token-related tables
-- Safe to run multiple times.

ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'api_tokens'
      AND policyname = 'user_manage_own_api_tokens'
  ) THEN
    CREATE POLICY user_manage_own_api_tokens
      ON public.api_tokens
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_integrations'
      AND policyname = 'user_manage_own_integrations'
  ) THEN
    CREATE POLICY user_manage_own_integrations
      ON public.user_integrations
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END;
$$;