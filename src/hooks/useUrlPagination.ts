import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export function useUrlPagination(
  pageSize = DEFAULT_PAGE_SIZE,
  pageParam = 'page',
) {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = useMemo(() => {
    const raw = Number(searchParams.get(pageParam) ?? DEFAULT_PAGE)
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : DEFAULT_PAGE
  }, [pageParam, searchParams])

  const setPage = useCallback(
    (nextPage: number) => {
      const safePage = Math.max(1, Math.floor(nextPage))
      const next = new URLSearchParams(searchParams)
      if (safePage === DEFAULT_PAGE) {
        next.delete(pageParam)
      } else {
        next.set(pageParam, String(safePage))
      }
      setSearchParams(next, { replace: true })
    },
    [pageParam, searchParams, setSearchParams],
  )

  return { page, pageSize, setPage }
}
