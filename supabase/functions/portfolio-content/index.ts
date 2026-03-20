import { createClient } from 'npm:@supabase/supabase-js@2'

const BUCKET_NAME = 'site-content'
const CONTENT_PATH = 'portfolio-content.json'
const SESSION_LIFETIME_SECONDS = 60 * 60 * 12

const ADMIN_USERNAME = Deno.env.get('ADMIN_USERNAME')
const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD')
const ADMIN_SESSION_SECRET = Deno.env.get('ADMIN_SESSION_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (
  !ADMIN_USERNAME ||
  !ADMIN_PASSWORD ||
  !ADMIN_SESSION_SECRET ||
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY
) {
  throw new Error('Missing required environment variables for portfolio-content.')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
const textEncoder = new TextEncoder()
let bucketReady = false

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
}

type PortfolioContent = {
  siteName: string
  heroHeadline: string
  projectEntries: unknown[]
  customSections: unknown[]
}

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

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

function encodeBase64Url(value: string | Uint8Array) {
  const bytes =
    typeof value === 'string' ? textEncoder.encode(value) : value

  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function decodeBase64Url(value: string) {
  const padding = (4 - (value.length % 4)) % 4
  const base64 =
    value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padding)
  const binary = atob(base64)

  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function createHmacKey(usage: 'sign' | 'verify') {
  return crypto.subtle.importKey(
    'raw',
    textEncoder.encode(ADMIN_SESSION_SECRET),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    [usage],
  )
}

async function createSessionToken(username: string) {
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS
  const payload = encodeBase64Url(
    JSON.stringify({
      sub: username,
      exp: expiresAt,
    }),
  )
  const content = `${header}.${payload}`
  const key = await createHmacKey('sign')
  const signature = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, textEncoder.encode(content)),
  )

  return {
    token: `${content}.${encodeBase64Url(signature)}`,
    expiresAt: new Date(expiresAt * 1000).toISOString(),
  }
}

async function verifySessionToken(token: string) {
  const [header, payload, signature] = token.split('.')

  if (!header || !payload || !signature) {
    return false
  }

  const key = await createHmacKey('verify')
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    decodeBase64Url(signature),
    textEncoder.encode(`${header}.${payload}`),
  )

  if (!isValid) {
    return false
  }

  try {
    const decoded = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(payload)),
    ) as { sub?: string; exp?: number }

    return (
      decoded.sub === ADMIN_USERNAME &&
      typeof decoded.exp === 'number' &&
      decoded.exp > Math.floor(Date.now() / 1000)
    )
  } catch {
    return false
  }
}

async function ensureBucket() {
  if (bucketReady) {
    return
  }

  const { error: getError } = await supabase.storage.getBucket(BUCKET_NAME)

  if (getError) {
    const { error: createError } = await supabase.storage.createBucket(
      BUCKET_NAME,
      {
        public: false,
        fileSizeLimit: '1MB',
        allowedMimeTypes: ['application/json'],
      },
    )

    if (createError && !/already exists/i.test(createError.message)) {
      throw createError
    }
  }

  bucketReady = true
}

async function readPortfolioContent() {
  await ensureBucket()

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(CONTENT_PATH)

  if (error) {
    if (/not found|does not exist/i.test(error.message)) {
      return null
    }

    throw error
  }

  const parsed = JSON.parse(await data.text())

  if (!isPortfolioContent(parsed)) {
    throw new Error('Stored content does not match the portfolio schema.')
  }

  return parsed
}

async function writePortfolioContent(content: PortfolioContent) {
  await ensureBucket()

  const file = new Blob([JSON.stringify(content, null, 2)], {
    type: 'application/json',
  })

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(
    CONTENT_PATH,
    file,
    {
      upsert: true,
      contentType: 'application/json',
      cacheControl: '0',
    },
  )

  if (error) {
    throw error
  }
}

async function isAuthorized(request: Request) {
  const authorization = request.headers.get('Authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return false
  }

  return verifySessionToken(authorization.slice('Bearer '.length))
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  if (request.method !== 'POST') {
    return jsonResponse(405, {
      error: 'Only POST requests are supported.',
    })
  }

  const body = (await request.json().catch(() => null)) as
    | {
        action?: string
        username?: string
        password?: string
        content?: PortfolioContent
      }
    | null

  if (!body?.action) {
    return jsonResponse(400, {
      error: 'Missing action.',
    })
  }

  try {
    if (body.action === 'get-public') {
      const content = await readPortfolioContent()

      return jsonResponse(200, {
        content,
      })
    }

    if (body.action === 'login') {
      if (
        body.username !== ADMIN_USERNAME ||
        body.password !== ADMIN_PASSWORD
      ) {
        return jsonResponse(401, {
          error: 'Invalid username or password.',
        })
      }

      const session = await createSessionToken(body.username)

      return jsonResponse(200, session)
    }

    if (body.action === 'save') {
      if (!(await isAuthorized(request))) {
        return jsonResponse(401, {
          error: 'Unauthorized. Sign in again to keep editing.',
        })
      }

      if (!isPortfolioContent(body.content)) {
        return jsonResponse(400, {
          error: 'Invalid portfolio payload.',
        })
      }

      await writePortfolioContent(body.content)

      return jsonResponse(200, {
        savedAt: new Date().toISOString(),
      })
    }

    return jsonResponse(400, {
      error: 'Unsupported action.',
    })
  } catch (error) {
    console.error(error)

    return jsonResponse(500, {
      error:
        error instanceof Error
          ? error.message
          : 'Unexpected portfolio backend error.',
    })
  }
})
