-- Admin-managed provider API keys for background model requests
-- api_key stores encrypted payload generated in app code (AES-256-GCM string: iv:tag:ciphertext)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(64) NOT NULL CHECK (provider IN ('novita', 'models_lab', 'openai', 'anthropic', 'custom')),
  api_key TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'untested' CHECK (status IN ('active', 'error', 'untested')),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  label VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_api_keys_provider ON admin_api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_admin_api_keys_status ON admin_api_keys(status);
CREATE UNIQUE INDEX IF NOT EXISTS uq_admin_api_keys_single_primary_per_provider
  ON admin_api_keys(provider)
  WHERE is_primary = TRUE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'set_updated_at_timestamp'
      AND pg_function_is_visible(oid)
  ) THEN
    CREATE FUNCTION set_updated_at_timestamp()
    RETURNS TRIGGER AS $fn$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $fn$ LANGUAGE plpgsql;
  END IF;
END
$$;

DROP TRIGGER IF EXISTS trigger_admin_api_keys_updated_at ON admin_api_keys;
CREATE TRIGGER trigger_admin_api_keys_updated_at
  BEFORE UPDATE ON admin_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();
