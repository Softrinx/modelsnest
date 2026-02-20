import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers at Outsoor',
  description: 'Join the Outsoor team and help build the future of AI infrastructure.',
}

const howWeWork = [
  {
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="6" stroke="#8C5CF7" strokeWidth="1.5" />
        <path d="M5 8h6M8 5v6" stroke="#8C5CF7" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    text: 'Remote-friendly with hubs where people can meet in person',
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path d="M2 10l4-4 3 3 5-5" stroke="#8C5CF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: 'Small, senior teams with lots of ownership and autonomy',
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <rect x="2" y="3" width="12" height="10" rx="2" stroke="#8C5CF7" strokeWidth="1.5" />
        <path d="M5 7h6M5 10h4" stroke="#8C5CF7" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
    text: 'Bias for shipping, observability and learning from real usage',
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="#8C5CF7" strokeWidth="1.5" />
        <path d="M8 5v3l2 2" stroke="#8C5CF7" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    text: 'Direct access to customers and real production workloads',
  },
]

const roles = [
  {
    title: 'Founding Engineer, Full-Stack',
    department: 'Engineering',
    location: 'Remote',
    description:
      'Help design and build the core dashboard and developer experience for Outsoor customers, from onboarding flows to usage analytics.',
  },
  {
    title: 'Senior Infrastructure Engineer',
    department: 'Engineering',
    location: 'Remote',
    description:
      'Own core pieces of the API platform: routing, rate limiting, observability and on-call reliability.',
  },
]

const s = {
  gradientText: {
    background: 'linear-gradient(90deg, #8C5CF7, #C85CFA, #5567F7)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#6B6B75',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    marginBottom: '1.75rem',
  },
  titleBar: {
    display: 'inline-block',
    width: '18px',
    height: '2px',
    background: 'linear-gradient(135deg, #8C5CF7, #5567F7)',
    borderRadius: '2px',
    flexShrink: 0,
  },
}

export default function CareersPage() {
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
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(140,92,247,0.13) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(85,103,247,0.07) 0%, transparent 60%)',
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
            Company · Careers
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
          {/* Badge */}
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
            We&apos;re hiring
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
            Build the future of{' '}
            <span style={s.gradientText}>AI infrastructure</span>
          </h1>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.75, color: '#A0A0A8', maxWidth: '580px' }}>
            We&apos;re building the AI infrastructure layer for modern software companies.
            If you care deeply about reliability, developer experience and thoughtful AI,
            you&apos;ll probably enjoy working with us.
          </p>
        </section>

        {/* How we work */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          <div style={s.sectionLabel}>
            <span style={s.titleBar} />
            How we work
          </div>
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
            {howWeWork.map((item) => (
              <div
                key={item.text}
                style={{
                  background: '#121214',
                  padding: '1.75rem 2rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '0.5rem',
                    background: 'rgba(140,92,247,0.12)',
                    border: '1px solid rgba(140,92,247,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {item.icon}
                </div>
                <span style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#A0A0A8' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Open roles */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
          <div style={s.sectionLabel}>
            <span style={s.titleBar} />
            Open roles
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {roles.map((role) => (
              <Link
                key={role.title}
                href="#"
                style={{
                  border: '1px solid #2D2D32',
                  borderRadius: '1rem',
                  background: '#121214',
                  padding: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '2rem',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  {/* Tags */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        background: 'rgba(140,92,247,0.1)',
                        border: '1px solid rgba(140,92,247,0.2)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase' as const,
                        color: '#8C5CF7',
                      }}
                    >
                      {role.department}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        background: '#22232A',
                        border: '1px solid #2D2D32',
                        fontSize: '0.7rem',
                        color: '#6B6B75',
                      }}
                    >
                      {role.location}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      marginBottom: '0.625rem',
                      color: '#FFFFFF',
                    }}
                  >
                    {role.title}
                  </div>

                  <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: '#A0A0A8', maxWidth: '560px' }}>
                    {role.description}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '40px',
                    height: '40px',
                    borderRadius: '0.5rem',
                    border: '1px solid #2D2D32',
                    background: '#1A1B1F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="#8C5CF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Open note */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
          <div
            style={{
              border: '1px solid #2D2D32',
              borderRadius: '1rem',
              background: '#121214',
              padding: '2rem 2.5rem',
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
                width: '280px',
                height: '200px',
                background: 'radial-gradient(ellipse at top right, rgba(200,92,250,0.1), transparent 65%)',
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
                  color: '#C85CFA',
                  marginBottom: '0.4rem',
                }}
              >
                Don&apos;t see a fit?
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
                We read every message
              </div>
              <p style={{ fontSize: '0.875rem', color: '#A0A0A8', lineHeight: 1.6 }}>
                If nothing above fits, reach out anyway — we&apos;re always interested in
                exceptional people who care about what we&apos;re building.
              </p>
            </div>
            <Link
              href="mailto:careers@outsoor.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #8C5CF7, #5567F7)',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 0 0 1px rgba(140,92,247,0.35), 0 4px 20px rgba(140,92,247,0.22)',
                whiteSpace: 'nowrap' as const,
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 15 15">
                <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="white" strokeWidth="1.25" />
                <path d="M1.5 3.5l6 5 6-5" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              careers@outsoor.com
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}