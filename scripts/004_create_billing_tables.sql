-- Create billing and credits tracking tables
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_topped_up DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('topup', 'usage', 'refund')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference_id VARCHAR(255), -- For payment processor reference
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, -- 'chat', 'api_call', etc.
    tokens_used INTEGER,
    cost DECIMAL(8,4) NOT NULL,
    model_used VARCHAR(100),
    request_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at);

-- Function to update user credits balance
CREATE OR REPLACE FUNCTION public.update_user_credits_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'topup' THEN
        INSERT INTO public.user_credits (user_id, balance, total_spent, total_topped_up, created_at, updated_at)
        VALUES (NEW.user_id, NEW.amount, 0.00, NEW.amount, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id)
        DO UPDATE SET
            balance = public.user_credits.balance + EXCLUDED.balance,
            total_topped_up = public.user_credits.total_topped_up + EXCLUDED.total_topped_up,
            updated_at = CURRENT_TIMESTAMP;
    ELSIF NEW.type = 'usage' THEN
        INSERT INTO public.user_credits (user_id, balance, total_spent, total_topped_up, created_at, updated_at)
        VALUES (NEW.user_id, -NEW.amount, NEW.amount, 0.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id)
        DO UPDATE SET
            balance = public.user_credits.balance - NEW.amount,
            total_spent = public.user_credits.total_spent + NEW.amount,
            updated_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update balance
DROP TRIGGER IF EXISTS trigger_update_credits_balance ON public.credit_transactions;
CREATE TRIGGER trigger_update_credits_balance
    AFTER INSERT ON public.credit_transactions
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION public.update_user_credits_balance();

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
