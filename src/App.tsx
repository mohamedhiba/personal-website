import { useEffect, useState, type FormEvent } from 'react'
import './App.css'
import './AdminPanel.css'
import { AdminPanel } from './AdminPanel'
import { Reveal } from './Reveal'
import { getNavLinks, type PortfolioContent } from './content'
import { loginPortfolioAdmin } from './portfolioApi'
import { usePortfolioContent } from './usePortfolioContent'

const ADMIN_SESSION_STORAGE_KEY = 'mohamed-hiba-portfolio-admin-session-v1'

type AdminSession = {
  token: string
  expiresAt: string
}

function isExternalLink(href: string) {
  return href.startsWith('http') || href.startsWith('mailto:')
}

function formatIndex(value: number) {
  return String(value).padStart(2, '0')
}

function loadAdminSession() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<AdminSession>

    if (
      typeof parsed.token === 'string' &&
      typeof parsed.expiresAt === 'string' &&
      new Date(parsed.expiresAt).getTime() > Date.now()
    ) {
      return parsed as AdminSession
    }
  } catch {
    return null
  }

  return null
}

function persistAdminSession(session: AdminSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(
    ADMIN_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  )
}

function clearAdminSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY)
}

function formatExpiry(expiresAt: string) {
  return new Date(expiresAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function PublicPortfolio({ content }: { content: PortfolioContent }) {
  const navLinks = getNavLinks(content)
  const experienceIndex = 3 + content.customSections.length
  const contactIndex = experienceIndex + 1

  return (
    <main className="site-shell">
      <Reveal className="site-header" as="header">
        <a className="site-name" href="#top" aria-label="Go to top">
          <strong>{content.siteName}</strong>
          <span>{content.siteRole}</span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </Reveal>

      <section className="hero" id="top">
        <Reveal className="hero-main" delay={60}>
          <p className="hero-eyebrow">{content.heroEyebrow}</p>
          <h1>{content.heroHeadline}</h1>

          <div className="hero-text">
            {content.heroParagraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="hero-actions">
            {content.utilityLinks.map((link) => (
              <a
                key={link.label}
                className="action-link"
                href={link.href}
                target={isExternalLink(link.href) ? '_blank' : undefined}
                rel={isExternalLink(link.href) ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal className="hero-aside" delay={160}>
          <figure className="portrait">
            <img src="/mohamed-hiba-avatar.jpg" alt="Mohamed Hiba portrait" />
          </figure>

          <dl className="fact-list">
            {content.heroFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="signal-strip" aria-label="Selected signals">
        {content.signalLines.map((signal, index) => (
          <Reveal
            key={signal.label}
            className="signal-item"
            as="article"
            delay={index * 70}
          >
            <strong>{signal.value}</strong>
            <span>{signal.label}</span>
            <p>{signal.detail}</p>
          </Reveal>
        ))}
      </section>

      <Reveal className="section-row" as="section" id="projects">
        <div className="section-marker">
          <span className="section-index">{formatIndex(1)}</span>
          <h2 className="section-title">Selected work</h2>
        </div>

        <div className="section-body">
          <p className="section-lede">{content.projectsIntro}</p>

          <div className="project-list">
            {content.projectEntries.map((project, index) => (
              <Reveal
                key={project.id}
                className="project-entry"
                as="article"
                delay={index * 70}
              >
                <div className="project-meta">
                  <span className="project-year">{project.year}</span>
                  <p className="project-kind">{project.kind}</p>
                </div>

                <div className="project-content">
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                  <p className="project-outcome">{project.outcome}</p>
                  <p className="project-detail">{project.why}</p>
                  <p className="project-stack">{project.stackLine}</p>

                  <dl className="project-facts">
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt>{metric.label}</dt>
                        <dd>{metric.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="project-links">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        className="text-link"
                        href={link.href}
                        target={isExternalLink(link.href) ? '_blank' : undefined}
                        rel={isExternalLink(link.href) ? 'noreferrer' : undefined}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="section-row" as="section" id="practice">
        <div className="section-marker">
          <span className="section-index">{formatIndex(2)}</span>
          <h2 className="section-title">Practice</h2>
        </div>

        <div className="section-body practice-grid">
          <div className="practice-copy">
            <p className="section-lede">{content.practiceIntro}</p>
            {content.practiceNotes.map((note, index) => (
              <p key={`${note.slice(0, 24)}-${index}`}>{note}</p>
            ))}
          </div>

          <div className="practice-columns">
            {content.toolColumns.map((column, index) => (
              <Reveal
                key={column.id}
                className="column-block"
                as="section"
                delay={index * 70}
              >
                <h3>{column.heading}</h3>
                <p>{column.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {content.customSections.map((section) => {
        const index = 3 + content.customSections.findIndex((item) => item.id === section.id)

        return (
          <Reveal
            key={section.id}
            className="section-row"
            as="section"
            id={`section-${section.id}`}
          >
            <div className="section-marker">
              <span className="section-index">{formatIndex(index)}</span>
              <h2 className="section-title">{section.title}</h2>
            </div>

            <div className="section-body custom-section">
              <p className="section-lede">{section.intro}</p>
              <div className="practice-copy">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={`${section.id}-${paragraphIndex}`}>{paragraph}</p>
                ))}
              </div>

              {section.links.length > 0 ? (
                <div className="project-links">
                  {section.links.map((link) => (
                    <a
                      key={link.label}
                      className="text-link"
                      href={link.href}
                      target={isExternalLink(link.href) ? '_blank' : undefined}
                      rel={isExternalLink(link.href) ? 'noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        )
      })}

      <Reveal className="section-row" as="section" id="experience">
        <div className="section-marker">
          <span className="section-index">{formatIndex(experienceIndex)}</span>
          <h2 className="section-title">Experience</h2>
        </div>

        <div className="section-body">
          <p className="section-lede">{content.experienceIntro}</p>

          <div className="experience-list">
            {content.experienceEntries.map((entry, index) => (
              <Reveal
                key={entry.id}
                className="experience-entry"
                as="article"
                delay={index * 70}
              >
                <div className="experience-period">{entry.period}</div>

                <div className="experience-main">
                  <div className="experience-heading">
                    <h3>
                      {entry.role} / {entry.org}
                    </h3>
                    <span>{entry.location}</span>
                  </div>

                  <p className="experience-summary">{entry.summary}</p>

                  <ul className="experience-bullets">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="section-row" as="section" id="contact">
        <div className="section-marker">
          <span className="section-index">{formatIndex(contactIndex)}</span>
          <h2 className="section-title">Contact</h2>
        </div>

        <div className="section-body contact-layout">
          <div className="contact-copy">
            <p className="contact-overline">One more useful signal</p>
            <h2>{content.contactHeadline}</h2>
            <p>{content.contactNote}</p>
            {content.contactDetails.map((detail, index) => (
              <p key={`${detail.slice(0, 20)}-${index}`}>{detail}</p>
            ))}
          </div>

          <div className="contact-links">
            {content.utilityLinks.map((link) => (
              <a
                key={link.label}
                className="text-link"
                href={link.href}
                target={isExternalLink(link.href) ? '_blank' : undefined}
                rel={isExternalLink(link.href) ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="more-work">
            <span>More public work</span>
            <div className="more-work-links">
              {content.extraLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  )
}

function AdminLogin({
  onLogin,
  isAuthenticating,
  error,
}: {
  onLogin: (username: string, password: string) => Promise<void>
  isAuthenticating: boolean
  error: string | null
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onLogin(username.trim(), password)
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-panel">
        <p className="admin-section-intro">Protected editor</p>
        <h1>Portfolio admin</h1>
        <p>
          This editor now saves to Supabase. Sign in to publish copy changes,
          add new sections, and update project entries.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Username</span>
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="admin-error">{error}</p> : null}

          <button type="submit" disabled={isAuthenticating}>
            {isAuthenticating ? 'Signing in...' : 'Open admin'}
          </button>
        </form>
      </section>
    </main>
  )
}

function App() {
  const isAdmin =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('admin') === '1'
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() =>
    loadAdminSession(),
  )
  const [authError, setAuthError] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const {
    content,
    setContent,
    isLoading,
    loadError,
    isDirty,
    isSaving,
    saveError,
    lastSavedAt,
    saveContent,
  } = usePortfolioContent({
    mode: isAdmin ? 'admin' : 'public',
    adminToken: adminSession?.token ?? null,
  })

  useEffect(() => {
    document.body.classList.toggle('admin-mode', isAdmin)

    return () => {
      document.body.classList.remove('admin-mode')
    }
  }, [isAdmin])

  useEffect(() => {
    if (!adminSession) {
      return
    }

    if (new Date(adminSession.expiresAt).getTime() <= Date.now()) {
      clearAdminSession()
      setAdminSession(null)
    }
  }, [adminSession])

  async function handleLogin(username: string, password: string) {
    setIsAuthenticating(true)
    setAuthError(null)

    try {
      const session = await loginPortfolioAdmin(username, password)
      persistAdminSession(session)
      setAdminSession(session)
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'Could not sign in to the admin.',
      )
    } finally {
      setIsAuthenticating(false)
    }
  }

  function handleLogout() {
    clearAdminSession()
    setAdminSession(null)
    setAuthError(null)
  }

  async function handleSave() {
    await saveContent()
  }

  if (isAdmin && !adminSession) {
    return (
      <AdminLogin
        onLogin={handleLogin}
        isAuthenticating={isAuthenticating}
        error={authError}
      />
    )
  }

  if (isAdmin) {
    return (
      <AdminPanel
        content={content}
        setContent={setContent}
        lastSavedAt={lastSavedAt}
        isLoading={isLoading}
        loadError={loadError}
        isDirty={isDirty}
        isSaving={isSaving}
        saveError={saveError}
        sessionExpiresAt={adminSession ? formatExpiry(adminSession.expiresAt) : null}
        onSave={handleSave}
        onLogout={handleLogout}
      />
    )
  }

  return <PublicPortfolio content={content} />
}

export default App
