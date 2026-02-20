import crypto from "crypto"

// Generate a user ID similar to Apify's format
export function generateUserId(email: string, id: string | number): string {
  const hash = crypto.createHash("md5").update(`${email}-${id}`).digest("hex")
  return hash.substring(0, 16).toUpperCase()
}

// Mask API token for display
export function maskToken(tokenPrefix: string): string {
  return `${tokenPrefix}${"•".repeat(40)}`
}

// Format date for display
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

// Copy to clipboard utility
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
