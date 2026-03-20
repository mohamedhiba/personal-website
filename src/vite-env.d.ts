/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
