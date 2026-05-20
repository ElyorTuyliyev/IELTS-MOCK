import { graphqlUrl } from '@/graphql/client'

/** Turn API logo path, data URL, or absolute URL into a loadable img src. */
export function resolveCenterLogoUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null
  const value = raw.trim()

  if (value.startsWith('data:')) return value
  if (/^https?:\/\//i.test(value)) return value

  // Vite public folder (e.g. /certificates/…)
  if (value.startsWith('/certificates/') || value.startsWith('/assets/')) {
    return value
  }

  // API upload path → backend static (uploads served at root)
  const base = graphqlUrl.replace(/\/graphql$/, '')
  return `${base}${value.startsWith('/') ? value : `/${value}`}`
}
