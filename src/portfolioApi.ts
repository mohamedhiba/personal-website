import type { PortfolioContent } from './content'

const SUPABASE_PROJECT_URL =
  import.meta.env.VITE_SUPABASE_PROJECT_URL ??
  'https://rvbfbeezjffdcdbhtdrb.supabase.co'

const FUNCTION_URL = `${SUPABASE_PROJECT_URL}/functions/v1/portfolio-content`

type ApiEnvelope<T> = {
  error?: string
} & T

type PublicContentResponse = ApiEnvelope<{
  content: PortfolioContent | null
}>

type LoginResponse = ApiEnvelope<{
  token: string
  expiresAt: string
}>

type SaveResponse = ApiEnvelope<{
  savedAt: string
}>

async function postJson<T>(
  body: Record<string, unknown>,
  options?: {
    token?: string | null
  },
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T>

  if (!response.ok) {
    throw new Error(payload.error ?? 'The portfolio service request failed.')
  }

  return payload
}

export async function fetchPortfolioContent() {
  const payload = await postJson<PublicContentResponse>({
    action: 'get-public',
  })

  return payload.content ?? null
}

export async function loginPortfolioAdmin(username: string, password: string) {
  const payload = await postJson<LoginResponse>({
    action: 'login',
    username,
    password,
  })

  return {
    token: payload.token,
    expiresAt: payload.expiresAt,
  }
}

export async function savePortfolioContent(
  token: string,
  content: PortfolioContent,
) {
  const payload = await postJson<SaveResponse>(
    {
      action: 'save',
      content,
    },
    {
      token,
    },
  )

  return {
    savedAt: payload.savedAt,
  }
}
