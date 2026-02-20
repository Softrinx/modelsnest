import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Outsoor Blog',
  description: 'Updates, product announcements, and best practices from the Outsoor team.',
}

const posts = [
  {
    tag: 'Product · Infrastructure',
    title: 'Launching Outsoor: AI infrastructure you can trust in production',
    date: 'May 2025',
    excerpt:
      'We built Outsoor after spending years maintaining brittle, home-grown AI stacks. In this post we share what "enterprise-grade" means to us and how we think about reliability, latency and cost.',
    featured: true,
  },
  {
    tag: 'Guides · Developers',
    title: 'Designing a fault-tolerant AI feature in under an hour',
    date: 'April 2025',
    excerpt:
      'A step-by-step walkthrough of how to go from idea to production for a simple AI-powered feature, using Outsoor APIs, observability and built-in safeguards.',
    featured: false,
  },
  {
    tag: 'Customers · Stories',
    title: 'How teams reduce incident load with Outsoor',
    date: 'March 2025',
    excerpt:
      'Teams are replacing ad-hoc scripts and one-off model calls with a managed platform. We share patterns we see across customers and what works well in production.',
    featured: false,
  },
]

const [featured, ...rest] = posts

export default function BlogPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D0D0F',
        color: '#FFFFFF',
        fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(140,92,247,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(85,103,247,0.07) 0%, transparent 60%)',
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: 'relative',
          zIndex: 10,
          borderBottom: '1px solid #2D2D32',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(13,13,15,0.8)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#A0A0A8',
              textDecoration: 'none',
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Outsoor
          </Link>
          <span style={{ fontSize: '0.75rem', color: '#6B6B75', letterSpacing: '0.04em' }}>
            Company · Blog
          </span>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <section
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '5rem 1.5rem 3.5rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              border: '1px solid #3D3D42',
              background: 'rgba(140,92,247,0.08)',
              fontSize: '0.72rem',
              color: '#A0A0A8',
              letterSpacing: '0.07em',
              textTransform: 'uppercase' as const,
              marginBottom: '2rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#8C5CF7',
                boxShadow: '0 0 8px #8C5CF7',
                display: 'inline-block',
              }}
            />
            From the team
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            The{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #8C5CF7, #C85CFA, #5567F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Outsoor
            </span>{' '}
            Blog
          </h1>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: '#A0A0A8', maxWidth: '560px' }}>
            Product updates, infrastructure deep-dives, and examples of how teams are
            using Outsoor in production.
          </p>
        </section>

        {/* Posts */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>

          {/* Section label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#6B6B75',
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              marginBottom: '2rem',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '18px',
                height: '2px',
                background: 'linear-gradient(135deg, #8C5CF7, #5567F7)',
                borderRadius: '2px',
              }}
            />
            Latest posts
          </div>

          {/* Featured post */}
          <Link
            href="#"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              border: '1px solid #2D2D32',
              borderRadius: '1rem',
              overflow: 'hidden',
              background: '#121214',
              marginBottom: '1.5rem',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {/* Visual panel */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1A1B1F 0%, #22232A 100%)',
                position: 'relative',
                minHeight: '260px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(ellipse 80% 80% at 30% 40%, rgba(140,92,247,0.25) 0%, transparent 70%)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '64px',
                  height: '64px',
                  borderRadius: '1rem',
                  background: 'rgba(140,92,247,0.15)',
                  border: '1px solid rgba(140,92,247,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                  <rect x="4" y="4" width="8" height="8" rx="2" fill="#8C5CF7" opacity="0.8" />
                  <rect x="16" y="4" width="8" height="8" rx="2" fill="#5567F7" opacity="0.6" />
                  <rect x="4" y="16" width="8" height="8" rx="2" fill="#5567F7" opacity="0.6" />
                  <rect x="16" y="16" width="8" height="8" rx="2" fill="#C85CFA" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* Content panel */}
            <div
              style={{
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase' as const,
                    color: '#8C5CF7',
                    marginBottom: '0.75rem',
                  }}
                >
                  {featured.tag}
                </div>
                <h2
                  style={{
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    marginBottom: '0.75rem',
                  }}
                >
                  {featured.title}
                </h2>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#A0A0A8' }}>
                  {featured.excerpt}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8125rem',
                  color: '#6B6B75',
                }}
              >
                <span>{featured.date}</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#8C5CF7',
                  }}
                >
                  Read post
                  <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="#8C5CF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Post grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1px',
              background: '#2D2D32',
              border: '1px solid #2D2D32',
              borderRadius: '1rem',
              overflow: 'hidden',
            }}
          >
            {rest.map(post => (
              <Link
                key={post.title}
                href="#"
                style={{
                  background: '#121214',
                  padding: '1.75rem 2rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase' as const,
                    color: '#8C5CF7',
                  }}
                >
                  {post.tag}
                </div>
                <div
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: '#FFFFFF',
                  }}
                >
                  {post.title}
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: '#A0A0A8', flexGrow: 1 }}>
                  {post.excerpt}
                </p>
                <div style={{ fontSize: '0.78rem', color: '#6B6B75', marginTop: 'auto' }}>
                  {post.date}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stay updated */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
          <div
            style={{
              border: '1px solid #2D2D32',
              borderRadius: '1rem',
              background: '#121214',
              padding: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap' as const,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '300px',
                background:
                  'radial-gradient(circle at top right, rgba(140,92,247,0.1), transparent 65%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase' as const,
                  color: '#8C5CF7',
                  marginBottom: '0.5rem',
                }}
              >
                Stay in the loop
              </div>
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginBottom: '0.375rem',
                }}
              >
                Never miss a post
              </div>
              <p style={{ fontSize: '0.875rem', color: '#A0A0A8', lineHeight: 1.6, maxWidth: '440px' }}>
                We publish when we launch major features, improve reliability or learn something
                useful about operating AI in production. Follow us or subscribe from your dashboard.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, position: 'relative' }}>
              <Link
                href="#"
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3D3D42',
                  background: '#1A1B1F',
                  color: '#A0A0A8',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                Follow on X
              </Link>
              <Link
                href="/dashboard"
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #8C5CF7, #5567F7)',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 0 0 1px rgba(140,92,247,0.35), 0 4px 20px rgba(140,92,247,0.22)',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                Subscribe from dashboard →
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}