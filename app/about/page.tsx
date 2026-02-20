import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Outsoor',
  description: 'Learn more about Outsoor, our mission, and the team behind the platform.',
}

const principles = [
  {
    label: 'Developer-first',
    description: 'Clear docs, simple APIs and honest errors. No magic, no mystery.',
  },
  {
    label: 'Reliability by default',
    description: 'We treat every request as production-critical, because it is.',
  },
  {
    label: 'Transparency',
    description: 'No surprise rate limits, hidden quotas, or ambiguous pricing.',
  },
  {
    label: 'Security',
    description: 'Data protection and compliance are built in from day one, not bolted on after.',
  },
]

const stats = [
  { value: '<200ms', label: 'Median latency from edge' },
  { value: '99.99%', label: 'Uptime SLO' },
  { value: '3', label: 'API modalities' },
  { value: '1', label: 'Unified API surface' },
]

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D0D0F',
        color: '#FFFFFF',
        fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
      }}
    >
      {/* Subtle background texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(140,92,247,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(85,103,247,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
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
            maxWidth: '1000px',
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
              transition: 'color 150ms cubic-bezier(0.4,0,0.2,1)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#A0A0A8')}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Outsoor
          </Link>
          <span style={{ fontSize: '0.75rem', color: '#6B6B75', letterSpacing: '0.04em' }}>
            Company · About
          </span>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '5rem 1.5rem 4rem',
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
              fontSize: '0.75rem',
              color: '#A0A0A8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
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
            AI Infrastructure
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              margin: '0 0 1.5rem',
            }}
          >
            Built for teams that{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #8C5CF7, #C85CFA, #5567F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ship fast
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.7,
              color: '#A0A0A8',
              maxWidth: '580px',
              margin: 0,
            }}
          >
            Outsoor is an AI infrastructure platform that gives product teams
            low-latency, production-ready APIs for language, vision and
            retrieval. We handle scaling, reliability and billing so you can
            focus on shipping features.
          </p>
        </section>

        {/* Stats strip */}
        <section
          style={{
            borderTop: '1px solid #2D2D32',
            borderBottom: '1px solid #2D2D32',
            background: '#121214',
          }}
        >
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '0 1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: '2rem 1.5rem',
                  borderRight: i < stats.length - 1 ? '1px solid #2D2D32' : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(90deg, #8C5CF7, #5567F7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.35rem',
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#6B6B75', lineHeight: 1.4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Body content */}
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '5rem 1.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem 5rem',
          }}
        >
          {/* What we do */}
          <section>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #8C5CF7, #5567F7)',
                  borderRadius: '2px',
                  flexShrink: 0,
                }}
              />
              What we do
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: '#A0A0A8', margin: '0 0 1rem' }}>
              Modern products rely on AI for search, support, automation and
              personalization — but wiring all of this together reliably is hard.
              Outsoor provides a single, consistent API surface on top of
              best-in-class models.
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                '<200ms median latency from edge locations',
                '99.99% uptime backed by strict SLOs',
                'Usage-based pricing with clear, predictable invoices',
                'Enterprise features like audit logs and SSO',
              ].map(item => (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    fontSize: '0.875rem',
                    color: '#A0A0A8',
                    lineHeight: 1.5,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  >
                    <circle cx="7" cy="7" r="6" stroke="#8C5CF7" strokeOpacity="0.3" />
                    <path d="M4.5 7l2 2 3-3" stroke="#8C5CF7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* How teams use Outsoor */}
          <section>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #8C5CF7, #5567F7)',
                  borderRadius: '2px',
                  flexShrink: 0,
                }}
              />
              How teams use Outsoor
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: '#A0A0A8', margin: 0 }}>
              Customers use Outsoor to power AI assistants inside their apps,
              automate internal workflows, summarize large volumes of data and
              build custom retrieval pipelines. Our APIs are designed to drop
              into existing stacks without forcing a full rewrite.
            </p>
          </section>

          {/* Principles — full width */}
          <section style={{ gridColumn: '1 / -1' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #8C5CF7, #5567F7)',
                  borderRadius: '2px',
                  flexShrink: 0,
                }}
              />
              Our principles
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1px',
                background: '#2D2D32',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid #2D2D32',
              }}
            >
              {principles.map((p, i) => (
                <div
                  key={p.label}
                  style={{
                    padding: '1.75rem 2rem',
                    background: '#121214',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Subtle corner accent on first card */}
                  {i === 0 && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '80px',
                        height: '80px',
                        background: 'radial-gradient(circle at top right, rgba(140,92,247,0.15), transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#8C5CF7',
                      letterSpacing: '0.02em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {p.label}
                  </div>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#A0A0A8', margin: 0 }}>
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div
          style={{
            borderTop: '1px solid #2D2D32',
            background: '#121214',
          }}
        >
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '3rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                Ready to start building?
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B6B75' }}>
                Get API access and have your first request running in minutes.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                href="/docs"
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3D3D42',
                  background: '#1A1B1F',
                  color: '#A0A0A8',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'border-color 150ms, color 150ms',
                }}
              >
                Read the docs
              </Link>
              <Link
                href="/signup"
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #8C5CF7, #5567F7)',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 0 0 1px rgba(140,92,247,0.3), 0 4px 16px rgba(140,92,247,0.2)',
                }}
              >
                Get started free →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}