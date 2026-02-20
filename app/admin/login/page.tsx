import { AdminLoginForm } from "@/components/admin-login-form"

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic'

// No need to check auth here - middleware handles redirects
// This page just renders the login form
export default function AdminLoginPage() {
  return <AdminLoginForm />
}
