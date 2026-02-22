-- Consolidated app tables migration (excluding users table)
-- Safe to run multiple times.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- API tokens
CREATE TABLE IF NOT EXISTS api_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'Default API token',
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  token_prefix VARCHAR(16) NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE api_tokens ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT 'Default API token';
ALTER TABLE api_tokens ADD COLUMN IF NOT EXISTS token_hash VARCHAR(255);
ALTER TABLE api_tokens ADD COLUMN IF NOT EXISTS token_prefix VARCHAR(16);
ALTER TABLE api_tokens ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE api_tokens ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE api_tokens ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE api_tokens ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE api_tokens ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'api_tokens'
      AND column_name = 'user_id'
      AND data_type <> 'uuid'
  ) THEN
    ALTER TABLE api_tokens DROP CONSTRAINT IF EXISTS api_tokens_user_id_fkey;
    ALTER TABLE api_tokens ALTER COLUMN user_id TYPE UUID USING user_id::text::uuid;
    ALTER TABLE api_tokens ADD CONSTRAINT api_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- User integrations
CREATE TABLE IF NOT EXISTS user_integrations (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type VARCHAR(100) NOT NULL,
  integration_name VARCHAR(255) NOT NULL,
  external_account_id VARCHAR(255),
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE user_integrations ADD COLUMN IF NOT EXISTS integration_type VARCHAR(100);
ALTER TABLE user_integrations ADD COLUMN IF NOT EXISTS integration_name VARCHAR(255);
ALTER TABLE user_integrations ADD COLUMN IF NOT EXISTS external_account_id VARCHAR(255);
ALTER TABLE user_integrations ADD COLUMN IF NOT EXISTS access_token_encrypted TEXT;
ALTER TABLE user_integrations ADD COLUMN IF NOT EXISTS refresh_token_encrypted TEXT;
ALTER TABLE user_integrations ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE user_integrations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE user_integrations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE user_integrations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_integrations'
      AND column_name = 'user_id'
      AND data_type <> 'uuid'
  ) THEN
    ALTER TABLE user_integrations DROP CONSTRAINT IF EXISTS user_integrations_user_id_fkey;
    ALTER TABLE user_integrations ALTER COLUMN user_id TYPE UUID USING user_id::text::uuid;
    ALTER TABLE user_integrations ADD CONSTRAINT user_integrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE password_reset_tokens ADD COLUMN IF NOT EXISTS token VARCHAR(255);
ALTER TABLE password_reset_tokens ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE password_reset_tokens ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE password_reset_tokens ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Credits balance
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_topped_up DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS total_topped_up DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Credit transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('topup', 'usage', 'refund')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS type VARCHAR(20);
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2);
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS reference_id VARCHAR(255);
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'completed';
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Usage logs
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type VARCHAR(50) NOT NULL,
  tokens_used INTEGER,
  cost DECIMAL(8,4) NOT NULL,
  model_used VARCHAR(100),
  request_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS service_type VARCHAR(50);
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS tokens_used INTEGER;
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS cost DECIMAL(8,4);
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS model_used VARCHAR(100);
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS request_id VARCHAR(255);
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_api_tokens_token_hash ON api_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_api_tokens_active ON api_tokens(is_active);

CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type ON user_integrations(integration_type);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_reference_id ON credit_transactions(reference_id);

CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_request_id ON usage_logs(request_id);

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_api_tokens_updated_at ON api_tokens;
CREATE TRIGGER trigger_api_tokens_updated_at
  BEFORE UPDATE ON api_tokens
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_user_integrations_updated_at ON user_integrations;
CREATE TRIGGER trigger_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_user_credits_updated_at ON user_credits;
CREATE TRIGGER trigger_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

-- Function to update user credits balance from transactions
CREATE OR REPLACE FUNCTION update_user_credits_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status <> 'completed' THEN
    RETURN NEW;
  END IF;

  IF NEW.type = 'topup' THEN
    UPDATE user_credits
    SET balance = balance + NEW.amount,
        total_topped_up = total_topped_up + NEW.amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.user_id;
  ELSIF NEW.type = 'usage' THEN
    UPDATE user_credits
    SET balance = balance - NEW.amount,
        total_spent = total_spent + NEW.amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.user_id;
  ELSIF NEW.type = 'refund' THEN
    UPDATE user_credits
    SET balance = GREATEST(0, balance - NEW.amount),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_credits_balance ON credit_transactions;
CREATE TRIGGER trigger_update_credits_balance
  AFTER INSERT ON credit_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits_balance();

-- Admin policy helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = TRUE
  );
END;
$$;

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_credits'
      AND policyname = 'admin_manage_user_credits'
  ) THEN
    CREATE POLICY admin_manage_user_credits
      ON public.user_credits
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_credits'
      AND policyname = 'user_read_own_credits'
  ) THEN
    CREATE POLICY user_read_own_credits
      ON public.user_credits
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'credit_transactions'
      AND policyname = 'admin_manage_credit_transactions'
  ) THEN
    CREATE POLICY admin_manage_credit_transactions
      ON public.credit_transactions
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'credit_transactions'
      AND policyname = 'user_read_own_credit_transactions'
  ) THEN
    CREATE POLICY user_read_own_credit_transactions
      ON public.credit_transactions
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'usage_logs'
      AND policyname = 'admin_manage_usage_logs'
  ) THEN
    CREATE POLICY admin_manage_usage_logs
      ON public.usage_logs
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'usage_logs'
      AND policyname = 'user_read_own_usage_logs'
  ) THEN
    CREATE POLICY user_read_own_usage_logs
      ON public.usage_logs
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END;
$$;

-- Initialize user credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, balance, total_spent, total_topped_up, created_at, updated_at)
  VALUES (NEW.id, 0.00, 0.00, 0.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_initialize_user_credits ON auth.users;
CREATE TRIGGER trigger_initialize_user_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_credits();
