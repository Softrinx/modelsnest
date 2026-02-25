import { requireAuth } from "@/lib/auth"
import { ModelDocsPage } from "@/components/model-docs-page"

// Force dynamic rendering to prevent prerendering issues with Client Components
export const dynamic = 'force-dynamic'

interface ModelDocsPageProps {
  params: {
    modelSlug: string
  }
}

export default async function ModelDocsPageRoute({ params }: ModelDocsPageProps) {
  const user = await requireAuth()
  const { modelSlug } = await params
  return <ModelDocsPage user={user} modelSlug={modelSlug} />
}
