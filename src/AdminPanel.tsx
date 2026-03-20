import { type ChangeEvent, type Dispatch, type SetStateAction } from 'react'
import './AdminPanel.css'
import {
  cloneDefaultPortfolioContent,
  createId,
  type CustomSection,
  type ExperienceEntry,
  type FactItem,
  type LinkItem,
  type PortfolioContent,
  type ProjectEntry,
  type ProjectMetric,
  type SignalItem,
  type TextColumn,
} from './content'

type AdminPanelProps = {
  content: PortfolioContent
  setContent: Dispatch<SetStateAction<PortfolioContent>>
  lastSavedAt: string | null
  isLoading: boolean
  loadError: string | null
  isDirty: boolean
  isSaving: boolean
  saveError: string | null
  sessionExpiresAt: string | null
  onSave: () => void
  onLogout: () => void
}

function updateArrayItem<T>(
  items: T[],
  index: number,
  updater: (item: T) => T,
) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? updater(item) : item,
  )
}

function removeArrayItem<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index)
}

function moveArrayItem<T>(items: T[], index: number, direction: -1 | 1) {
  const targetIndex = index + direction

  if (targetIndex < 0 || targetIndex >= items.length) {
    return items
  }

  const copy = [...items]
  const current = copy[index]
  copy[index] = copy[targetIndex]
  copy[targetIndex] = current
  return copy
}

function downloadContent(content: PortfolioContent) {
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'mohamed-hiba-portfolio-content.json'
  anchor.click()
  URL.revokeObjectURL(url)
}

function parseImportFile(
  event: ChangeEvent<HTMLInputElement>,
  onLoad: (content: PortfolioContent) => void,
) {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result)) as PortfolioContent
      onLoad(parsed)
    } catch {
      window.alert('Could not parse that JSON file.')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

function Field({
  label,
  value,
  onChange,
  rows = 0,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  rows?: number
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {rows > 0 ? (
        <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function FactEditor({
  items,
  onChange,
}: {
  items: FactItem[]
  onChange: (next: FactItem[]) => void
}) {
  return (
    <div className="admin-card-list">
      <div className="admin-list-toolbar">
        <span>Hero facts</span>
        <button
          type="button"
          onClick={() =>
            onChange([...items, { label: 'Label', value: 'Value' }])
          }
        >
          Add fact
        </button>
      </div>

      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="admin-card">
          <div className="admin-card-actions">
            <span>Fact {index + 1}</span>
            <button type="button" onClick={() => onChange(removeArrayItem(items, index))}>
              Remove
            </button>
          </div>
          <div className="admin-inline-grid">
            <Field
              label="Label"
              value={item.label}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, label: next })))
              }
            />
            <Field
              label="Value"
              value={item.value}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, value: next })))
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function LinkEditor({
  items,
  onChange,
  addLabel,
}: {
  items: LinkItem[]
  onChange: (next: LinkItem[]) => void
  addLabel: string
}) {
  return (
    <div className="admin-card-list">
      <div className="admin-list-toolbar">
        <span>{addLabel}</span>
        <button
          type="button"
          onClick={() => onChange([...items, { label: 'Label', href: 'https://example.com' }])}
        >
          Add link
        </button>
      </div>

      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="admin-card">
          <div className="admin-card-actions">
            <span>Link {index + 1}</span>
            <button type="button" onClick={() => onChange(removeArrayItem(items, index))}>
              Remove
            </button>
          </div>
          <div className="admin-inline-grid">
            <Field
              label="Label"
              value={item.label}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, label: next })))
              }
            />
            <Field
              label="Href"
              value={item.href}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, href: next })))
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SignalEditor({
  items,
  onChange,
}: {
  items: SignalItem[]
  onChange: (next: SignalItem[]) => void
}) {
  return (
    <div className="admin-card-list">
      <div className="admin-list-toolbar">
        <span>Signal strip</span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              { value: '0', label: 'New signal', detail: 'Explain what this number means.' },
            ])
          }
        >
          Add signal
        </button>
      </div>

      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="admin-card">
          <div className="admin-card-actions">
            <span>Signal {index + 1}</span>
            <div className="admin-toolbar">
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, -1))}>
                Move up
              </button>
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, 1))}>
                Move down
              </button>
              <button type="button" onClick={() => onChange(removeArrayItem(items, index))}>
                Remove
              </button>
            </div>
          </div>
          <div className="admin-inline-grid">
            <Field
              label="Value"
              value={item.value}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, value: next })))
              }
            />
            <Field
              label="Label"
              value={item.label}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, label: next })))
              }
            />
          </div>
          <Field
            label="Detail"
            value={item.detail}
            rows={4}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, detail: next })))
            }
          />
        </div>
      ))}
    </div>
  )
}

function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string
  items: string[]
  onChange: (next: string[]) => void
  placeholder: string
}) {
  return (
    <div className="admin-card-list">
      <div className="admin-list-toolbar">
        <span>{label}</span>
        <button type="button" onClick={() => onChange([...items, placeholder])}>
          Add item
        </button>
      </div>

      {items.map((item, index) => (
        <div key={`${label}-${index}`} className="admin-card">
          <div className="admin-card-actions">
            <span>Item {index + 1}</span>
            <div className="admin-toolbar">
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, -1))}>
                Move up
              </button>
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, 1))}>
                Move down
              </button>
              <button type="button" onClick={() => onChange(removeArrayItem(items, index))}>
                Remove
              </button>
            </div>
          </div>
          <Field
            label="Text"
            value={item}
            rows={4}
            onChange={(next) => onChange(updateArrayItem(items, index, () => next))}
          />
        </div>
      ))}
    </div>
  )
}

function MetricEditor({
  items,
  onChange,
}: {
  items: ProjectMetric[]
  onChange: (next: ProjectMetric[]) => void
}) {
  return (
    <div className="admin-card-list">
      <div className="admin-list-toolbar">
        <span>Metrics</span>
        <button
          type="button"
          onClick={() => onChange([...items, { label: 'Metric label', value: 'Metric value' }])}
        >
          Add metric
        </button>
      </div>

      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="admin-card">
          <div className="admin-card-actions">
            <span>Metric {index + 1}</span>
            <button type="button" onClick={() => onChange(removeArrayItem(items, index))}>
              Remove
            </button>
          </div>
          <div className="admin-inline-grid">
            <Field
              label="Label"
              value={item.label}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, label: next })))
              }
            />
            <Field
              label="Value"
              value={item.value}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, value: next })))
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectEditor({
  items,
  onChange,
}: {
  items: ProjectEntry[]
  onChange: (next: ProjectEntry[]) => void
}) {
  return (
    <div className="admin-card-list">
      <div className="admin-list-toolbar">
        <span>Projects</span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                id: createId('project'),
                year: '2026',
                kind: 'New section',
                name: 'New Project',
                summary: 'Short summary.',
                outcome: 'Best outcome or metric.',
                why: 'Why this project matters.',
                stackLine: 'Tool / Tool / Tool',
                metrics: [{ label: 'Metric', value: 'Value' }],
                links: [{ label: 'Repository', href: 'https://github.com/mohamedhiba' }],
              },
            ])
          }
        >
          Add project
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="admin-card">
          <div className="admin-card-header">
            <div>
              <span>Project {index + 1}</span>
              <h3>{item.name}</h3>
            </div>
            <div className="admin-toolbar">
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, -1))}>
                Move up
              </button>
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, 1))}>
                Move down
              </button>
              <button type="button" onClick={() => onChange(removeArrayItem(items, index))}>
                Remove
              </button>
            </div>
          </div>

          <div className="admin-inline-grid">
            <Field
              label="Year"
              value={item.year}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, year: next })))
              }
            />
            <Field
              label="Kind"
              value={item.kind}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, kind: next })))
              }
            />
          </div>

          <Field
            label="Name"
            value={item.name}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, name: next })))
            }
          />
          <Field
            label="Summary"
            value={item.summary}
            rows={4}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, summary: next })))
            }
          />
          <Field
            label="Outcome"
            value={item.outcome}
            rows={3}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, outcome: next })))
            }
          />
          <Field
            label="Why it matters"
            value={item.why}
            rows={4}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, why: next })))
            }
          />
          <Field
            label="Stack line"
            value={item.stackLine}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, stackLine: next })))
            }
          />

          <MetricEditor
            items={item.metrics}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, metrics: next })))
            }
          />

          <LinkEditor
            items={item.links}
            addLabel="Project links"
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, links: next })))
            }
          />
        </div>
      ))}
    </div>
  )
}

function TextColumnEditor({
  items,
  onChange,
}: {
  items: TextColumn[]
  onChange: (next: TextColumn[]) => void
}) {
  return (
    <div className="admin-card-list">
      <div className="admin-list-toolbar">
        <span>Tool columns</span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              { id: createId('column'), heading: 'New column', body: 'Describe this column.' },
            ])
          }
        >
          Add column
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="admin-card">
          <div className="admin-card-actions">
            <span>Column {index + 1}</span>
            <div className="admin-toolbar">
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, -1))}>
                Move up
              </button>
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, 1))}>
                Move down
              </button>
              <button type="button" onClick={() => onChange(removeArrayItem(items, index))}>
                Remove
              </button>
            </div>
          </div>
          <Field
            label="Heading"
            value={item.heading}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, heading: next })))
            }
          />
          <Field
            label="Body"
            value={item.body}
            rows={4}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, body: next })))
            }
          />
        </div>
      ))}
    </div>
  )
}

function CustomSectionEditor({
  items,
  onChange,
}: {
  items: CustomSection[]
  onChange: (next: CustomSection[]) => void
}) {
  return (
    <div className="admin-card-list">
      <div className="admin-list-toolbar">
        <span>Custom sections</span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                id: createId('section'),
                title: 'New Section',
                intro: 'Short introduction for this section.',
                paragraphs: ['First paragraph.'],
                links: [],
              },
            ])
          }
        >
          Add section
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="admin-card">
          <div className="admin-card-header">
            <div>
              <span>Section {index + 1}</span>
              <h3>{item.title}</h3>
            </div>
            <div className="admin-toolbar">
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, -1))}>
                Move up
              </button>
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, 1))}>
                Move down
              </button>
              <button type="button" onClick={() => onChange(removeArrayItem(items, index))}>
                Remove
              </button>
            </div>
          </div>

          <Field
            label="Title"
            value={item.title}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, title: next })))
            }
          />
          <Field
            label="Intro"
            value={item.intro}
            rows={3}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, intro: next })))
            }
          />

          <StringListEditor
            label="Paragraphs"
            items={item.paragraphs}
            placeholder="New paragraph."
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, paragraphs: next })))
            }
          />

          <LinkEditor
            items={item.links}
            addLabel="Section links"
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, links: next })))
            }
          />
        </div>
      ))}
    </div>
  )
}

function ExperienceEditor({
  items,
  onChange,
}: {
  items: ExperienceEntry[]
  onChange: (next: ExperienceEntry[]) => void
}) {
  return (
    <div className="admin-card-list">
      <div className="admin-list-toolbar">
        <span>Experience entries</span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                id: createId('experience'),
                period: '2026',
                role: 'New role',
                org: 'New organization',
                location: 'Location',
                summary: 'Short summary.',
                bullets: ['First bullet.'],
              },
            ])
          }
        >
          Add entry
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="admin-card">
          <div className="admin-card-header">
            <div>
              <span>Experience {index + 1}</span>
              <h3>
                {item.role} / {item.org}
              </h3>
            </div>
            <div className="admin-toolbar">
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, -1))}>
                Move up
              </button>
              <button type="button" onClick={() => onChange(moveArrayItem(items, index, 1))}>
                Move down
              </button>
              <button type="button" onClick={() => onChange(removeArrayItem(items, index))}>
                Remove
              </button>
            </div>
          </div>

          <div className="admin-inline-grid">
            <Field
              label="Period"
              value={item.period}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, period: next })))
              }
            />
            <Field
              label="Location"
              value={item.location}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, location: next })))
              }
            />
          </div>
          <div className="admin-inline-grid">
            <Field
              label="Role"
              value={item.role}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, role: next })))
              }
            />
            <Field
              label="Organization"
              value={item.org}
              onChange={(next) =>
                onChange(updateArrayItem(items, index, (current) => ({ ...current, org: next })))
              }
            />
          </div>
          <Field
            label="Summary"
            value={item.summary}
            rows={4}
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, summary: next })))
            }
          />
          <StringListEditor
            label="Bullets"
            items={item.bullets}
            placeholder="New bullet."
            onChange={(next) =>
              onChange(updateArrayItem(items, index, (current) => ({ ...current, bullets: next })))
            }
          />
        </div>
      ))}
    </div>
  )
}

export function AdminPanel({
  content,
  setContent,
  lastSavedAt,
  isLoading,
  loadError,
  isDirty,
  isSaving,
  saveError,
  sessionExpiresAt,
  onSave,
  onLogout,
}: AdminPanelProps) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <strong>Portfolio Admin</strong>
          <span>Supabase-backed editor</span>
        </div>

        <small className="admin-saved">
          {lastSavedAt
            ? `Published to Supabase at ${lastSavedAt}`
            : 'No published change in this session yet'}
        </small>

        {sessionExpiresAt ? (
          <small className="admin-saved">Session ends around {sessionExpiresAt}</small>
        ) : null}

        <div className="admin-sync-box">
          <strong>{isSaving ? 'Publishing...' : isDirty ? 'Local draft' : 'Synced'}</strong>
          <p>
            {isLoading
              ? 'Loading the latest published content.'
              : isDirty
                ? 'Your edits are local until you publish them.'
                : 'The editor matches the published portfolio.'}
          </p>
          {loadError ? <p className="admin-error">{loadError}</p> : null}
          {saveError ? <p className="admin-error">{saveError}</p> : null}
        </div>

        <div className="admin-actions">
          <button type="button" onClick={onSave} disabled={isSaving || isLoading}>
            {isSaving ? 'Publishing...' : 'Publish changes'}
          </button>
          <a href="/">Open public site</a>
          <button type="button" onClick={() => downloadContent(content)}>
            Export JSON
          </button>
          <label className="admin-upload-label">
            Import JSON
            <input
              type="file"
              accept="application/json"
              onChange={(event) => parseImportFile(event, setContent)}
            />
          </label>
          <button type="button" onClick={() => setContent(cloneDefaultPortfolioContent())}>
            Reset to defaults
          </button>
          <button type="button" onClick={onLogout}>
            Log out
          </button>
        </div>

        <div className="admin-nav">
          <button type="button" onClick={() => document.getElementById('admin-hero')?.scrollIntoView()}>
            Hero
          </button>
          <button type="button" onClick={() => document.getElementById('admin-signals')?.scrollIntoView()}>
            Signals
          </button>
          <button type="button" onClick={() => document.getElementById('admin-projects')?.scrollIntoView()}>
            Projects
          </button>
          <button type="button" onClick={() => document.getElementById('admin-practice')?.scrollIntoView()}>
            Practice
          </button>
          <button type="button" onClick={() => document.getElementById('admin-custom')?.scrollIntoView()}>
            Custom sections
          </button>
          <button type="button" onClick={() => document.getElementById('admin-experience')?.scrollIntoView()}>
            Experience
          </button>
          <button type="button" onClick={() => document.getElementById('admin-contact')?.scrollIntoView()}>
            Contact and repos
          </button>
        </div>

        <div className="admin-help">
          <p>How this works</p>
          <ul>
            <li>Edits stay local until you press Publish changes.</li>
            <li>Use export and import to back up or move your content.</li>
            <li>Add projects and custom sections without editing code.</li>
          </ul>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-intro">
          <span className="admin-section-intro">Editor</span>
          <h1>Change copy, add projects, and create new public sections.</h1>
          <p>
            This editor keeps the writing flow simple, but now publishes through
            Supabase so your live site can update from anywhere you log in.
          </p>
        </header>

        <div className="admin-grid">
          <section className="admin-section" id="admin-hero">
            <h2>Hero and identity</h2>
            <div className="admin-fields">
              <Field
                label="Site name"
                value={content.siteName}
                onChange={(next) => setContent((current) => ({ ...current, siteName: next }))}
              />
              <Field
                label="Site role"
                value={content.siteRole}
                onChange={(next) => setContent((current) => ({ ...current, siteRole: next }))}
              />
              <Field
                label="Hero eyebrow"
                value={content.heroEyebrow}
                onChange={(next) => setContent((current) => ({ ...current, heroEyebrow: next }))}
              />
              <Field
                label="Hero headline"
                value={content.heroHeadline}
                rows={3}
                onChange={(next) => setContent((current) => ({ ...current, heroHeadline: next }))}
              />
            </div>

            <StringListEditor
              label="Hero paragraphs"
              items={content.heroParagraphs}
              placeholder="New hero paragraph."
              onChange={(next) => setContent((current) => ({ ...current, heroParagraphs: next }))}
            />

            <FactEditor
              items={content.heroFacts}
              onChange={(next) => setContent((current) => ({ ...current, heroFacts: next }))}
            />

            <LinkEditor
              items={content.utilityLinks}
              addLabel="Top utility links"
              onChange={(next) => setContent((current) => ({ ...current, utilityLinks: next }))}
            />
          </section>

          <section className="admin-section" id="admin-signals">
            <h2>Signals</h2>
            <SignalEditor
              items={content.signalLines}
              onChange={(next) => setContent((current) => ({ ...current, signalLines: next }))}
            />
          </section>

          <section className="admin-section" id="admin-projects">
            <h2>Projects</h2>
            <Field
              label="Projects intro"
              value={content.projectsIntro}
              rows={3}
              onChange={(next) => setContent((current) => ({ ...current, projectsIntro: next }))}
            />
            <ProjectEditor
              items={content.projectEntries}
              onChange={(next) => setContent((current) => ({ ...current, projectEntries: next }))}
            />
          </section>

          <section className="admin-section" id="admin-practice">
            <h2>Practice and tools</h2>
            <Field
              label="Practice intro"
              value={content.practiceIntro}
              rows={3}
              onChange={(next) => setContent((current) => ({ ...current, practiceIntro: next }))}
            />

            <StringListEditor
              label="Practice notes"
              items={content.practiceNotes}
              placeholder="New practice note."
              onChange={(next) => setContent((current) => ({ ...current, practiceNotes: next }))}
            />

            <TextColumnEditor
              items={content.toolColumns}
              onChange={(next) => setContent((current) => ({ ...current, toolColumns: next }))}
            />
          </section>

          <section className="admin-section" id="admin-custom">
            <h2>Custom sections</h2>
            <p className="admin-section-intro">
              Add new editorial sections that show up between Practice and Experience.
            </p>
            <CustomSectionEditor
              items={content.customSections}
              onChange={(next) => setContent((current) => ({ ...current, customSections: next }))}
            />
          </section>

          <section className="admin-section" id="admin-experience">
            <h2>Experience</h2>
            <Field
              label="Experience intro"
              value={content.experienceIntro}
              rows={3}
              onChange={(next) => setContent((current) => ({ ...current, experienceIntro: next }))}
            />

            <ExperienceEditor
              items={content.experienceEntries}
              onChange={(next) => setContent((current) => ({ ...current, experienceEntries: next }))}
            />
          </section>

          <section className="admin-section" id="admin-contact">
            <h2>Contact and more repos</h2>
            <Field
              label="Contact headline"
              value={content.contactHeadline}
              rows={3}
              onChange={(next) => setContent((current) => ({ ...current, contactHeadline: next }))}
            />
            <Field
              label="Contact note"
              value={content.contactNote}
              rows={4}
              onChange={(next) => setContent((current) => ({ ...current, contactNote: next }))}
            />

            <StringListEditor
              label="Contact details"
              items={content.contactDetails}
              placeholder="New contact detail."
              onChange={(next) => setContent((current) => ({ ...current, contactDetails: next }))}
            />

            <LinkEditor
              items={content.extraLinks}
              addLabel="More repos"
              onChange={(next) => setContent((current) => ({ ...current, extraLinks: next }))}
            />
          </section>
        </div>
      </section>
    </main>
  )
}
