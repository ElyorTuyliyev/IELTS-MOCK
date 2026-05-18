import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export const PAYMENTS_TAB_PARAM = 'tab'

export const PAYMENTS_TABS = {
  pending: 'pending',
  payments: 'payments',
} as const

export type PaymentsTabKey = (typeof PAYMENTS_TABS)[keyof typeof PAYMENTS_TABS]

const DEFAULT_TAB: PaymentsTabKey = PAYMENTS_TABS.pending

function parseTabParam(raw: string | null): PaymentsTabKey {
  if (raw === PAYMENTS_TABS.payments) return PAYMENTS_TABS.payments
  return DEFAULT_TAB
}

export function usePaymentsTab() {
  const [searchParams, setSearchParams] = useSearchParams()

  const tab = useMemo(
    () => parseTabParam(searchParams.get(PAYMENTS_TAB_PARAM)),
    [searchParams],
  )

  const setTab = useCallback(
    (nextTab: PaymentsTabKey) => {
      const next = new URLSearchParams(searchParams)
      if (nextTab === DEFAULT_TAB) {
        next.delete(PAYMENTS_TAB_PARAM)
      } else {
        next.set(PAYMENTS_TAB_PARAM, nextTab)
      }
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  return { tab, setTab }
}
