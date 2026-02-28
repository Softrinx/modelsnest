import { createAdminClient } from "@/lib/supabase/server"
import type { Endpoint } from "@/app/actions/rate-limits"

interface EffectiveRule {
  endpoint: Endpoint | "all"
  requests_per_minute: number | null
  requests_per_hour: number | null
  requests_per_day: number | null
  max_daily_spend_usd: number | null
  is_active: boolean
}

export interface RateLimitCheckResult {
  allowed: boolean
  reason?: string
  limit?: number
  remaining?: number
  resetAt?: Date
  retryAfter?: number
}

function toDateSecondsAgo(seconds: number) {
  return new Date(Date.now() - seconds * 1000)
}

function toDateHoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
}

async function getRequestCount(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
  endpoint: Endpoint,
  since: Date,
) {
  const { count, error } = await supabase
    .from("usage_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("endpoint", endpoint)
    .gte("created_at", since.toISOString())

  if (error) {
    throw new Error(error.message || "Failed to count requests")
  }

  return count || 0
}

async function getDailySpend(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
  endpoint: Endpoint,
  since: Date,
) {
  const { data, error } = await supabase
    .from("usage_logs")
    .select("cost, cost_usd")
    .eq("user_id", userId)
    .eq("endpoint", endpoint)
    .gte("created_at", since.toISOString())

  if (error) {
    throw new Error(error.message || "Failed to compute spend")
  }

  return (data || []).reduce((sum, row) => {
    const value = Number(row.cost_usd ?? row.cost ?? 0)
    return sum + (Number.isFinite(value) ? value : 0)
  }, 0)
}

async function resolveRule(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
  endpoint: Endpoint,
): Promise<EffectiveRule | null> {
  const { data: specificOverride } = await supabase
    .from("rate_limit_overrides")
    .select("endpoint, requests_per_minute, requests_per_hour, requests_per_day, max_daily_spend_usd")
    .eq("user_id", userId)
    .eq("endpoint", endpoint)
    .maybeSingle()

  if (specificOverride) {
    return {
      endpoint,
      requests_per_minute: specificOverride.requests_per_minute,
      requests_per_hour: specificOverride.requests_per_hour,
      requests_per_day: specificOverride.requests_per_day,
      max_daily_spend_usd: specificOverride.max_daily_spend_usd,
      is_active: true,
    }
  }

  const { data: allOverride } = await supabase
    .from("rate_limit_overrides")
    .select("endpoint, requests_per_minute, requests_per_hour, requests_per_day, max_daily_spend_usd")
    .eq("user_id", userId)
    .eq("endpoint", "all")
    .maybeSingle()

  if (allOverride) {
    return {
      endpoint: "all",
      requests_per_minute: allOverride.requests_per_minute,
      requests_per_hour: allOverride.requests_per_hour,
      requests_per_day: allOverride.requests_per_day,
      max_daily_spend_usd: allOverride.max_daily_spend_usd,
      is_active: true,
    }
  }

  const { data: globalRule } = await supabase
    .from("rate_limit_rules")
    .select("endpoint, requests_per_minute, requests_per_hour, requests_per_day, max_daily_spend_usd, is_active")
    .eq("endpoint", endpoint)
    .maybeSingle()

  if (!globalRule) {
    return null
  }

  return {
    endpoint,
    requests_per_minute: globalRule.requests_per_minute,
    requests_per_hour: globalRule.requests_per_hour,
    requests_per_day: globalRule.requests_per_day,
    max_daily_spend_usd: globalRule.max_daily_spend_usd,
    is_active: globalRule.is_active,
  }
}

export async function checkRateLimit(userId: string, endpoint: Endpoint): Promise<RateLimitCheckResult> {
  const supabase = await createAdminClient()

  const rule = await resolveRule(supabase, userId, endpoint)
  if (!rule) {
    return { allowed: true }
  }

  if (!rule.is_active) {
    return { allowed: true }
  }

  const now = new Date()

  if (typeof rule.requests_per_minute === "number" && rule.requests_per_minute >= 0) {
    const minuteCount = await getRequestCount(supabase, userId, endpoint, toDateSecondsAgo(60))
    if (minuteCount >= rule.requests_per_minute) {
      return {
        allowed: false,
        reason: `You have exceeded the rate limit of ${rule.requests_per_minute} requests per minute for the ${endpoint} endpoint.`,
        limit: rule.requests_per_minute,
        remaining: 0,
        resetAt: new Date(now.getTime() + 60 * 1000),
        retryAfter: 60,
      }
    }
  }

  if (typeof rule.requests_per_hour === "number" && rule.requests_per_hour >= 0) {
    const hourCount = await getRequestCount(supabase, userId, endpoint, toDateHoursAgo(1))
    if (hourCount >= rule.requests_per_hour) {
      return {
        allowed: false,
        reason: `You have exceeded the rate limit of ${rule.requests_per_hour} requests per hour for the ${endpoint} endpoint.`,
        limit: rule.requests_per_hour,
        remaining: 0,
        resetAt: new Date(now.getTime() + 60 * 60 * 1000),
        retryAfter: 3600,
      }
    }
  }

  if (typeof rule.requests_per_day === "number" && rule.requests_per_day >= 0) {
    const dayCount = await getRequestCount(supabase, userId, endpoint, toDateHoursAgo(24))
    if (dayCount >= rule.requests_per_day) {
      return {
        allowed: false,
        reason: `You have exceeded the daily request limit of ${rule.requests_per_day} for the ${endpoint} endpoint.`,
        limit: rule.requests_per_day,
        remaining: 0,
        resetAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        retryAfter: 86400,
      }
    }
  }

  if (typeof rule.max_daily_spend_usd === "number" && rule.max_daily_spend_usd >= 0) {
    const dailySpend = await getDailySpend(supabase, userId, endpoint, toDateHoursAgo(24))
    if (dailySpend >= rule.max_daily_spend_usd) {
      return {
        allowed: false,
        reason: `You have exceeded the daily spend limit of $${rule.max_daily_spend_usd} for the ${endpoint} endpoint.`,
        limit: Number(rule.max_daily_spend_usd),
        remaining: 0,
        resetAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        retryAfter: 86400,
      }
    }
  }

  return { allowed: true }
}
