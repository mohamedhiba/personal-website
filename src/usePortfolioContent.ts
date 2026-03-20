import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { cloneDefaultPortfolioContent, type PortfolioContent } from './content'
import {
  fetchPortfolioContent,
  savePortfolioContent,
} from './portfolioApi'

const ADMIN_DRAFT_STORAGE_KEY = 'mohamed-hiba-portfolio-admin-draft-v1'

type PortfolioMode = 'public' | 'admin'

function isPortfolioContent(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<PortfolioContent>

  return (
    typeof candidate.siteName === 'string' &&
    typeof candidate.heroHeadline === 'string' &&
    Array.isArray(candidate.projectEntries) &&
    Array.isArray(candidate.customSections)
  )
}

function loadAdminDraft() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_DRAFT_STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    return isPortfolioContent(parsed) ? parsed : null
  } catch {
    return null
  }
}

function persistAdminDraft(content: PortfolioContent) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_DRAFT_STORAGE_KEY, JSON.stringify(content))
}

function clearAdminDraft() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(ADMIN_DRAFT_STORAGE_KEY)
}

function formatSavedTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function usePortfolioContent({
  mode,
  adminToken,
}: {
  mode: PortfolioMode
  adminToken?: string | null
}) {
  const initialDraft = mode === 'admin' ? loadAdminDraft() : null
  const [content, setContentState] = useState<PortfolioContent>(() =>
    initialDraft ?? cloneDefaultPortfolioContent(),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(Boolean(initialDraft))
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadRemoteContent() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const remoteContent = await fetchPortfolioContent()

        if (cancelled || !remoteContent) {
          return
        }

        if (mode === 'admin' && loadAdminDraft()) {
          setIsDirty(true)
          return
        }

        setContentState(remoteContent)
        setIsDirty(false)
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Could not load the latest portfolio content.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadRemoteContent()

    return () => {
      cancelled = true
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'admin' || !isDirty) {
      return
    }

    persistAdminDraft(content)
  }, [content, isDirty, mode])

  const setContent: Dispatch<SetStateAction<PortfolioContent>> = (next) => {
    setContentState((current) =>
      typeof next === 'function'
        ? (next as (value: PortfolioContent) => PortfolioContent)(current)
        : next,
    )

    if (mode === 'admin') {
      setIsDirty(true)
      setSaveError(null)
    }
  }

  async function saveContent() {
    if (mode !== 'admin') {
      return false
    }

    if (!adminToken) {
      setSaveError('Your admin session expired. Sign in again to publish changes.')
      return false
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const result = await savePortfolioContent(adminToken, content)
      clearAdminDraft()
      setIsDirty(false)
      setLastSavedAt(formatSavedTime(result.savedAt))
      return true
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Could not publish your portfolio changes.',
      )
      return false
    } finally {
      setIsSaving(false)
    }
  }

  function discardAdminDraft() {
    if (mode !== 'admin') {
      return
    }

    clearAdminDraft()
    setIsDirty(false)
  }

  return {
    content,
    setContent,
    isLoading,
    loadError,
    isDirty,
    isSaving,
    saveError,
    lastSavedAt,
    saveContent,
    discardAdminDraft,
  }
}
