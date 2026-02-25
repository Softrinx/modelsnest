-- Model catalog + documentation tables
-- Stores all model listing and docs data currently hardcoded in the dashboard UI.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS ai_model_categories (
  slug VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(50),
  display_order INTEGER NOT NULL DEFAULT 0,
  color VARCHAR(20),
  icon_name VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(128) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  category_slug VARCHAR(64) REFERENCES ai_model_categories(slug) ON DELETE SET NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  performance INTEGER CHECK (performance IS NULL OR (performance >= 0 AND performance <= 100)),
  last_used_label VARCHAR(120),
  is_favorite_default BOOLEAN NOT NULL DEFAULT FALSE,
  has_documentation BOOLEAN NOT NULL DEFAULT FALSE,
  badge VARCHAR(100),
  display_color VARCHAR(20),
  card_description TEXT,
  docs_index_description TEXT,
  models_page_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  docs_index_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_model_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
  source VARCHAR(32) NOT NULL CHECK (source IN ('models_page', 'docs_index', 'docs_page')),
  feature_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (model_id, source, feature_text)
);

CREATE TABLE IF NOT EXISTS ai_model_pricing (
  model_id UUID PRIMARY KEY REFERENCES ai_models(id) ON DELETE CASCADE,
  input_price NUMERIC(12,6) NOT NULL DEFAULT 0,
  output_price NUMERIC(12,6) NOT NULL DEFAULT 0,
  price_unit VARCHAR(64) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_model_docs (
  model_id UUID PRIMARY KEY REFERENCES ai_models(id) ON DELETE CASCADE,
  docs_description TEXT,
  endpoint_method VARCHAR(16),
  endpoint_path VARCHAR(255),
  endpoint_status VARCHAR(64),
  response_example TEXT,
  docs_page_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_model_doc_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (model_id, step_order)
);

CREATE TABLE IF NOT EXISTS ai_model_doc_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
  param_name VARCHAR(120) NOT NULL,
  param_type VARCHAR(64) NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  default_value TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (model_id, param_name)
);

CREATE TABLE IF NOT EXISTS ai_model_doc_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
  language VARCHAR(32) NOT NULL,
  code_example TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (model_id, language)
);

CREATE INDEX IF NOT EXISTS idx_ai_models_category_slug ON ai_models(category_slug);
CREATE INDEX IF NOT EXISTS idx_ai_models_status ON ai_models(status);
CREATE INDEX IF NOT EXISTS idx_ai_models_sort_order ON ai_models(sort_order);
CREATE INDEX IF NOT EXISTS idx_ai_model_features_model_id ON ai_model_features(model_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_pricing_unit ON ai_model_pricing(price_unit);
CREATE INDEX IF NOT EXISTS idx_ai_model_doc_steps_model_id ON ai_model_doc_steps(model_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_doc_parameters_model_id ON ai_model_doc_parameters(model_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_doc_examples_model_id ON ai_model_doc_examples(model_id);

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

DROP TRIGGER IF EXISTS trigger_ai_model_categories_updated_at ON ai_model_categories;
CREATE TRIGGER trigger_ai_model_categories_updated_at
  BEFORE UPDATE ON ai_model_categories
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_ai_models_updated_at ON ai_models;
CREATE TRIGGER trigger_ai_models_updated_at
  BEFORE UPDATE ON ai_models
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_ai_model_pricing_updated_at ON ai_model_pricing;
CREATE TRIGGER trigger_ai_model_pricing_updated_at
  BEFORE UPDATE ON ai_model_pricing
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_ai_model_docs_updated_at ON ai_model_docs;
CREATE TRIGGER trigger_ai_model_docs_updated_at
  BEFORE UPDATE ON ai_model_docs
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();
