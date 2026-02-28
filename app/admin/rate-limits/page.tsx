import { AdminRateLimitsClient } from "@/components/admin-rate-limits-client"
import { getGlobalRules, getRateLimitOverrides } from "@/app/actions/rate-limits"

export default async function AdminRateLimitsPage() {
  const [initialRules, initialOverrides] = await Promise.all([
    getGlobalRules(),
    getRateLimitOverrides(),
  ])

  return (
    <AdminRateLimitsClient
      initialRules={initialRules}
      initialOverrides={initialOverrides}
    />
  )
}