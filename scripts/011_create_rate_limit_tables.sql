-- Rate limiting tables + usage_logs compatibility columns

CREATE TABLE IF NOT EXISTS rate_limit_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  requests_per_minute INTEGER NOT NULL DEFAULT 60,
  requests_per_hour INTEGER NOT NULL DEFAULT 1000,
  requests_per_day INTEGER NOT NULL DEFAULT 10000,
  max_daily_spend_usd NUMERIC(10,4) NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rate_limit_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  requests_per_minute INTEGER,
  requests_per_hour INTEGER,
  requests_per_day INTEGER,
  max_daily_spend_usd NUMERIC(10,4),
  reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS endpoint TEXT;
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS cost_usd NUMERIC(12,4);

UPDATE usage_logs
SET endpoint = CASE
  WHEN endpoint IS NOT NULL AND btrim(endpoint) <> '' THEN endpoint
  WHEN service_type = 'chat' THEN 'chat'
  WHEN service_type = 'image_generation' THEN 'images'
  WHEN service_type = 'audio_transcription' THEN 'audio'
  WHEN service_type = 'video_generation' THEN 'video'
  WHEN service_type = 'text_to_speech' THEN 'tts'
  ELSE 'unknown'
END
WHERE endpoint IS NULL OR btrim(endpoint) = '';

UPDATE usage_logs
SET cost_usd = cost
WHERE cost_usd IS NULL;

CREATE INDEX IF NOT EXISTS idx_usage_logs_user_endpoint_created_at
  ON usage_logs(user_id, endpoint, created_at);

INSERT INTO rate_limit_rules (endpoint, requests_per_minute, requests_per_hour, requests_per_day, max_daily_spend_usd, is_active) VALUES
  ('chat',   60,  1000, 10000, 50, TRUE),
  ('images', 10,   200,  1000, 20, TRUE),
  ('audio',  20,   400,  2000, 10, TRUE),
  ('video',   5,    50,   200, 30, FALSE),
  ('tts',    30,   500,  3000, 15, TRUE)
ON CONFLICT (endpoint) DO NOTHING;

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

DROP TRIGGER IF EXISTS trigger_rate_limit_rules_updated_at ON rate_limit_rules;
CREATE TRIGGER trigger_rate_limit_rules_updated_at
  BEFORE UPDATE ON rate_limit_rules
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_rate_limit_overrides_updated_at ON rate_limit_overrides;
CREATE TRIGGER trigger_rate_limit_overrides_updated_at
  BEFORE UPDATE ON rate_limit_overrides
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();
